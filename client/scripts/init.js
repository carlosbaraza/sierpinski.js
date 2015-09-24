/******************************************************************************/
// Initialise the actual Sierpinski Triangle graphic
/******************************************************************************/

import * as draw from './lib/draw';
import { renderer, stage } from './stage';

// Collection to keep track of the triangles (Array of Arrays)
var triangles = sierpinski();

export { triangles, splitTriangles, mergeTriangles };


/******************************************************************************/
// Hoisted functions
/******************************************************************************/
function sierpinski() {
  var theTriangle = buildMasterTriangle();
  stage.addChild(theTriangle);

  return [theTriangle];

  function buildMasterTriangle() {
    var canvasWidth = renderer.view.width;
    var canvasHeight = renderer.view.height;

    var triangleBase = (canvasHeight * 0.9) / Math.sin(Math.PI / 180 * 60);
    return draw.triangle({
      x: (canvasWidth - triangleBase) / 2,
      y: canvasHeight * 0.95,
      base: triangleBase
    });
  }
}

// Split visible triangles, wider than maxWidth
function splitTriangles(maxWidth = 0) {
  var isSplitable = (tr) => tr.width * stage.scale.x > maxWidth;

  triangles = triangles
    .map(function findSplitableTriangles(obj) {
      if (obj.constructor === Array)
        return obj.map(findSplitableTriangles);
      if (!obj.visible) return obj;
      if (isSplitable(obj)) return splitTriangle(obj);
      return obj;
    });
}

function splitTriangle(triangle) {
  triangle.scale.x *= 0.5;
  triangle.scale.y *= 0.5;

  var newTriangle1 = draw.triangle({
    x: triangle.position.x + triangle.width,
    y: triangle.position.y,
    base: triangle.width
  });

  var newTriangle2 = draw.triangle({
    x: triangle.position.x + triangle.width / 2,
    y: triangle.position.y - triangle.height,
    base: triangle.width
  });

  stage.addChild(newTriangle1);
  stage.addChild(newTriangle2);

  return [triangle, newTriangle1, newTriangle2];
}

// Merge triangles wider than minWidth.
function mergeTriangles(minWidth = 5) {
  triangles = triangles
    .map(function findMergeableTriangles(obj) {
      if (obj.constructor === Array && areAllGraphics(obj)) {
        if (smallerThanMin(obj)) return _mergeTriangles(obj);
        return obj;
      }
      if (obj.constructor === Array) return obj.map(findMergeableTriangles);
      return obj;
    });

  function areAllGraphics(graphics) { return _.every(graphics, isGraphic); }
  function isGraphic(graphic) { return graphic.constructor === PIXI.Graphics; }
  function _mergeTriangles(triangles) {
    // Resize the remaining graphic
    var newScale = triangles[0].scale.x * 2;
    triangles[0].scale.set(newScale, newScale);

    stage.removeChild(triangles[1]);
    stage.removeChild(triangles[2]);

    return triangles[0];
  }
  function smallerThanMin(triangles) {
    return _.every(triangles, (tr) => tr.width * stage.scale.x < minWidth);
  }
}
