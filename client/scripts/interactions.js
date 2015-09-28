/**
 * @file Module to handle interactions with application.
 * @description Encapsulates handlers for interactions with the application.
 * @module interactions
 */

import { addWheelListener } from './lib/wheelListener';

/**
 * Exported function to initiate the zoom and panning in the app.
 * @param  {PIXI.Container} stage - Container of the objects.
 * @param  {PIXI.WebGLRenderer} renderer - Object that extends canvas.
 */
export function zoomAndPanStart(stage, renderer) {
  addWheelListener(renderer.view, (e) => {
    zoom(e.clientX - 100, e.clientY, e.deltaY < 0);
  });

  var hammer = new Hammer.Manager(renderer.view);

  addDragAndDropListeners();
  addPinchListener();

  function addPinchListener() {
    hammer.add( new Hammer.Pinch({threshold: 0, pointers: 2}) );
    hammer.on('pinchstart pinchmove', (e) => {
      zoom(e.center.x, e.center.y, e.scale > 1);
    });
  }

  function zoom(x, y, isZoomIn) {
    var direction = isZoomIn ? 1 : -1;
    var factor = 1 + direction * 0.03;

    var inWorldPos = {
      x: (x - stage.x) / stage.scale.x,
      y: (y - stage.y) / stage.scale.y
    };

    var newScaleX = stage.scale.x * factor,
        newScaleY = stage.scale.y * factor;
    var newScale = {
      x: newScaleX < 0.5 ? 0.5 : newScaleX > 48E11 ? 48E11 : newScaleX,
      y: newScaleY < 0.5 ? 0.5 : newScaleY > 48E11 ? 48E11 : newScaleY
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
    var prevX, prevY;

    hammer.add( new Hammer.Pan({threshold: 0, pointers: 1}) );

    hammer.on('panstart panmove', function(e) {
      if (e.type == 'panstart') {
        prevX = stage.position.x;
        prevY = stage.position.y;
      }
      stage.position.x = prevX + e.deltaX;
      stage.position.y = prevY + e.deltaY;
    });
  }
}
