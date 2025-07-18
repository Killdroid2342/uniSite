document.addEventListener('DOMContentLoaded', () => {
  const screenWidth = window.innerWidth;
  const spacing = Math.min(120, screenWidth / 4.5);
  const activeTouches = new Map();
  let isMouseDragging = false;
  let currentMouseTarget = null;
  let mouseShiftX = 0,
    mouseShiftY = 0;

  document.querySelectorAll('.boxes').forEach((div, index) => {
    const id = div.dataset.id || index;
    div.style.position = 'absolute';

    const savedPosition = localStorage.getItem(`box-${id}`);
    if (savedPosition) {
      const { left, top } = JSON.parse(savedPosition);
      div.style.left = left;
      div.style.top = top;
    } else {
      div.style.left = `${20 + index * spacing}px`;
      div.style.top = '50px';
    }

    div.addEventListener(
      'touchstart',
      (e) => {
        document.querySelectorAll('.boxes').forEach((el) => {
          el.style.border = 'none';
        });

        div.style.border = '2px dotted #222222';

        for (const touch of e.changedTouches) {
          if (activeTouches.has(touch.identifier)) continue;

          const rect = div.getBoundingClientRect();
          const shiftX = touch.clientX - rect.left;
          const shiftY = touch.clientY - rect.top;

          activeTouches.set(touch.identifier, {
            div,
            shiftX,
            shiftY,
          });
        }
      },
      { passive: false }
    );

    div.addEventListener(
      'touchmove',
      (e) => {
        e.preventDefault();
        for (const touch of e.changedTouches) {
          const touchData = activeTouches.get(touch.identifier);
          if (!touchData) continue;

          const { div, shiftX, shiftY } = touchData;

          const moveX = touch.clientX;
          const moveY = touch.clientY;

          const left = Math.min(
            window.innerWidth - div.offsetWidth,
            Math.max(0, moveX - shiftX)
          );
          const top = Math.min(
            window.innerHeight - div.offsetHeight,
            Math.max(0, moveY - shiftY)
          );

          div.style.left = `${left}px`;
          div.style.top = `${top}px`;

          localStorage.setItem(
            `box-${div.dataset.id || index}`,
            JSON.stringify({ left: div.style.left, top: div.style.top })
          );
        }
      },
      { passive: false }
    );

    div.addEventListener('touchend', (e) => {
      for (const touch of e.changedTouches) {
        activeTouches.delete(touch.identifier);
      }
    });

    div.addEventListener('touchcancel', (e) => {
      for (const touch of e.changedTouches) {
        activeTouches.delete(touch.identifier);
      }
    });

    div.addEventListener('mousedown', (e) => {
      e.preventDefault();
      isMouseDragging = true;
      currentMouseTarget = div;

      const rect = div.getBoundingClientRect();
      mouseShiftX = e.clientX - rect.left;
      mouseShiftY = e.clientY - rect.top;

      document.querySelectorAll('.boxes').forEach((el) => {
        el.style.border = 'none';
      });
      div.style.border = '2px dotted #222222';
    });

    div.addEventListener('click', (e) => {
      const justDragged = div.dataset.justDragged === 'true';
      if (justDragged) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }
      if (id === 'about-us') location.href = 'aboutus.html';
      else if (id === 'founders') location.href = 'founders.html';
      else if (id === 'events') location.href = 'events.html';
    });
  });

  document.addEventListener('mousemove', (e) => {
    if (!isMouseDragging || !currentMouseTarget) return;

    const div = currentMouseTarget;

    const moveX = e.clientX;
    const moveY = e.clientY;

    const left = Math.min(
      window.innerWidth - div.offsetWidth,
      Math.max(0, moveX - mouseShiftX)
    );
    const top = Math.min(
      window.innerHeight - div.offsetHeight,
      Math.max(0, moveY - mouseShiftY)
    );

    div.style.left = `${left}px`;
    div.style.top = `${top}px`;

    const id = div.dataset.id;
    localStorage.setItem(
      `box-${id}`,
      JSON.stringify({ left: div.style.left, top: div.style.top })
    );

    div.dataset.justDragged = 'true';
    setTimeout(() => {
      div.dataset.justDragged = 'false';
    }, 100);
  });

  document.addEventListener('mouseup', () => {
    isMouseDragging = false;
    currentMouseTarget = null;
  });
});
