import { addWheelListener } from './lib/wheelListener';

export function zoomAndPanStart(stage, renderer) {
  addWheelListener(renderer.view, (e) => {
    zoom(e.clientX, e.clientY, e.deltaY < 0);
  });

  addDragAndDropListeners();

  function zoom(x, y, isZoomIn) {
    var direction = isZoomIn ? 1 : -1;
    var factor = 1 + direction * 0.03;

    var inWorldPos = {
      x: (x - stage.x) / stage.scale.x,
      y: (y - stage.y) / stage.scale.y
    };

    var newScale = {
      x: stage.scale.x * factor,
      y: stage.scale.y * factor
    };

    var newScreenPos = {
      x: (inWorldPos.x) * newScale.x + stage.x,
      y: (inWorldPos.y) * newScale.y + stage.y
    };

    stage.x += x - newScreenPos.x;
    stage.y += y - newScreenPos.y;
    stage.scale.x = newScale.x;
    stage.scale.y = newScale.y;
  }

  function addDragAndDropListeners() {
    var isDragging = false,
        prevX, prevY;

    renderer.view.onmousedown = (e) => {
      prevX = e.clientX;
      prevY = e.clientY;
      isDragging = true;
    };

    renderer.view.onmousemove = (e) => {
      if (!isDragging) return;
      var dx = e.clientX - prevX;
      var dy = e.clientY - prevY;

      stage.position.x += dx;
      stage.position.y += dy;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    renderer.view.onmouseup = (e) => isDragging = false;
  }
}
