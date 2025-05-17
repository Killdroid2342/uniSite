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

  div.addEventListener('mousedown', (e) => {
    e.preventDefault();
    didDrag = false;

    shiftX = e.clientX - div.getBoundingClientRect().left;
    shiftY = e.clientY - div.getBoundingClientRect().top;

    function onMouseMove(e) {
      const left = e.pageX - shiftX;
      const top = e.pageY - shiftY;

      div.style.left = left + 'px';
      div.style.top = top + 'px';

      localStorage.setItem(
        `box-${id}`,
        JSON.stringify({ left: div.style.left, top: div.style.top })
      );
      didDrag = true;
    }

    function onMouseUp() {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      if (didDrag) {
        div.dataset.justDragged = 'true';
        setTimeout(() => {
          div.dataset.justDragged = 'false';
        }, 100);
      }
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  div.addEventListener('click', (e) => {
    if (div.dataset.justDragged === 'true') {
      e.preventDefault();
      e.stopImmediatePropagation();
      return;
    }
    location.href = `page.html?id=${id}`;
  });
});
