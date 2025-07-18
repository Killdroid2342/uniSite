document.addEventListener('DOMContentLoaded', () => {
  const screenWidth = window.innerWidth;
  const spacing = Math.min(120, screenWidth / 4.5);

  const activeTouches = new Map();

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
        e.preventDefault(); // prevent scrolling
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

    div.addEventListener('click', (e) => {
      if (div.dataset.justDragged === 'true') {
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }
      const id = div.dataset.id || index;
      if (id === 'about-us') location.href = 'aboutus.html';
      else if (id === 'founders') location.href = 'founders.html';
      else if (id === 'events') location.href = 'events.html';
    });
  });
});
