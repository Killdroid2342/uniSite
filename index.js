document.addEventListener('DOMContentLoaded', () => {
  const activeTouches = new Map();
  let isMouseDragging = false;
  let currentMouseTarget = null;
  let mouseShiftX = 0,
    mouseShiftY = 0;
  let mouseMovedDuringDrag = false;

  const modal = document.getElementById('modal');

  const defaultPositions = {
    founders: { leftPercent: 12.7, topPercent: 20 },
    events: { leftPercent: 65.6, topPercent: 55.6 },
    'about-us': { leftPercent: 75.3, topPercent: 24.5 },
    members: { leftPercent: 10.9, topPercent: 56.8 },
  };

  function percentToPx(percent, axis) {
    return axis === 'x'
      ? (percent * window.innerWidth) / 100
      : (percent * window.innerHeight) / 100;
  }

  function pxToPercent(px, axis) {
    return axis === 'x'
      ? (px / window.innerWidth) * 100
      : (px / window.innerHeight) * 100;
  }

  function positionDiv(div, id) {
    const savedPosition = localStorage.getItem(`box-${id}`);
    if (savedPosition) {
      const { leftPercent, topPercent } = JSON.parse(savedPosition);
      div.style.left = `${percentToPx(leftPercent, 'x')}px`;
      div.style.top = `${percentToPx(topPercent, 'y')}px`;
    } else if (defaultPositions[id]) {
      div.style.left = `${percentToPx(
        defaultPositions[id].leftPercent,
        'x'
      )}px`;
      div.style.top = `${percentToPx(defaultPositions[id].topPercent, 'y')}px`;
    } else {
      div.style.left = '0px';
      div.style.top = '0px';
    }
  }

  document.querySelectorAll('.boxes').forEach((div, index) => {
    const id = div.dataset.id || index;
    div.style.position = 'absolute';
    positionDiv(div, id);

    div.addEventListener(
      'touchstart',
      (e) => {
        document
          .querySelectorAll('.boxes')
          .forEach((el) => el.classList.remove('selected'));
        div.classList.add('selected');

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

          const leftPx = Math.min(
            window.innerWidth - div.offsetWidth,
            Math.max(0, moveX - shiftX)
          );
          const topPx = Math.min(
            window.innerHeight - div.offsetHeight,
            Math.max(0, moveY - shiftY)
          );

          div.style.left = `${leftPx}px`;
          div.style.top = `${topPx}px`;

          localStorage.setItem(
            `box-${div.dataset.id || index}`,
            JSON.stringify({
              leftPercent: pxToPercent(leftPx, 'x'),
              topPercent: pxToPercent(topPx, 'y'),
            })
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
      mouseMovedDuringDrag = false;
      currentMouseTarget = div;

      const rect = div.getBoundingClientRect();
      mouseShiftX = e.clientX - rect.left;
      mouseShiftY = e.clientY - rect.top;

      document
        .querySelectorAll('.boxes')
        .forEach((el) => el.classList.remove('selected'));
      div.classList.add('selected');
    });

    div.addEventListener('click', (e) => {
      if (mouseMovedDuringDrag) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }

      if (id === 'about-us') location.href = 'aboutus.html';
      else if (id === 'founders') location.href = 'founders.html';
      else if (id === 'events') location.href = 'events.html';
      else if (id === 'members') modal.style.display = 'flex';
    });
  });

  document.addEventListener('mousemove', (e) => {
    if (!isMouseDragging || !currentMouseTarget) return;

    mouseMovedDuringDrag = true;

    const div = currentMouseTarget;
    const moveX = e.clientX;
    const moveY = e.clientY;

    const leftPx = Math.min(
      window.innerWidth - div.offsetWidth,
      Math.max(0, moveX - mouseShiftX)
    );
    const topPx = Math.min(
      window.innerHeight - div.offsetHeight,
      Math.max(0, moveY - mouseShiftY)
    );

    div.style.left = `${leftPx}px`;
    div.style.top = `${topPx}px`;

    const id = div.dataset.id;
    localStorage.setItem(
      `box-${id}`,
      JSON.stringify({
        leftPercent: pxToPercent(leftPx, 'x'),
        topPercent: pxToPercent(topPx, 'y'),
      })
    );
  });

  document.addEventListener('mouseup', () => {
    isMouseDragging = false;
    currentMouseTarget = null;
  });

  document.body.addEventListener('click', (e) => {
    if (
      ![...e.composedPath()].some(
        (el) => el.classList && el.classList.contains('boxes')
      )
    ) {
      document
        .querySelectorAll('.boxes')
        .forEach((el) => el.classList.remove('selected'));
    }
  });

  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      document.querySelectorAll('.boxes').forEach((div, index) => {
        const id = div.dataset.id || index;
        positionDiv(div, id);
      });
    }, 300);
  });

  const texts = document.querySelectorAll('.textHover');
  let index = 0;

  function highlightText() {
    texts.forEach((el) => el.classList.remove('active'));
    texts[index].classList.add('active');
    index = (index + 1) % texts.length;
  }

  highlightText();
  setInterval(highlightText, 2000);
});
