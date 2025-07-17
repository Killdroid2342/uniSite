document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.boxes').forEach((div, index) => {
    const id = div.dataset.id || index;

    div.style.position = 'absolute';

    const savedPosition = localStorage.getItem(`box-${id}`);
    if (savedPosition) {
      const { left, top } = JSON.parse(savedPosition);
      div.style.left = left;
      div.style.top = top;
    } else {
      div.style.left = `${50 + index * 150}px`;
      div.style.top = '50px';
    }

    let didDrag = false;
    let shiftX, shiftY;

    function startDrag(e) {
      e.preventDefault();
      didDrag = false;

      document
        .querySelectorAll('.boxes')
        .forEach((el) => (el.style.border = 'none'));
      div.style.border = '2px dotted #222222';

      const clientX = e.type.startsWith('touch')
        ? e.touches[0].clientX
        : e.clientX;
      const clientY = e.type.startsWith('touch')
        ? e.touches[0].clientY
        : e.clientY;

      shiftX = clientX - div.getBoundingClientRect().left;
      shiftY = clientY - div.getBoundingClientRect().top;

      function onMove(e) {
        const moveX = e.type.startsWith('touch') ? e.touches[0].pageX : e.pageX;
        const moveY = e.type.startsWith('touch') ? e.touches[0].pageY : e.pageY;

        const left = moveX - shiftX;
        const top = moveY - shiftY;

        div.style.left = left + 'px';
        div.style.top = top + 'px';

        localStorage.setItem(
          `box-${id}`,
          JSON.stringify({ left: div.style.left, top: div.style.top })
        );
        didDrag = true;
      }

      function endDrag(e) {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', endDrag);
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', endDrag);

        if (!didDrag) {
          handleBoxClick(id);
        }

        div.dataset.justDragged = didDrag ? 'true' : 'false';
        setTimeout(() => {
          div.dataset.justDragged = 'false';
        }, 100);
      }

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', endDrag);
      document.addEventListener('touchmove', onMove, { passive: false });
      document.addEventListener('touchend', endDrag);
    }

    div.addEventListener('mousedown', startDrag);
    div.addEventListener('touchstart', startDrag, { passive: false });

    div.addEventListener('click', (e) => {
      if (div.dataset.justDragged === 'true') {
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }
      handleBoxClick(id);
    });

    function handleBoxClick(id) {
      if (id === 'about-us') {
        location.href = 'aboutus.html';
      } else if (id === 'founders') {
        location.href = 'founders.html';
      } else if (id === 'events') {
        location.href = 'events.html';
      }
    }
  });
});
