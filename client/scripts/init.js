/******************************************************************************/
// Initialise the actual Sierpinski Triangle graphic
/******************************************************************************/

import * as draw from './lib/draw';
import { renderer, stage } from './stage';

// Collection to keep track of the triangles (Array of Arrays)
var triangles = sierpinski();
for (let i = 0; i < 7; i++) splitTriangles();

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

// Split the deepest layer of triangles
function splitTriangles() { triangles = triangles.map(splitTriangle); }

// Split the deepest layer of triangles from given triangle
function splitTriangle(triangle) {
  if (triangle.constructor === Array) return triangle.map(splitTriangle);

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

// Merge the deepest triangle level.
// TODO: Refactor and write tests.
function mergeTriangles() {
  var isGraphic = (graphic) => graphic.constructor === PIXI.Graphics;
  var allGraphics = (graphics) => _.every(graphics, isGraphic);

  triangles = triangles.map(merge);

  function merge(triangles) {
    if (triangles.constructor === Array && allGraphics(triangles)) {
      // Resize the remaining graphic
      var newScale = triangles[0].scale.x * 2;
      triangles[0].scale.set(newScale, newScale);

      stage.removeChild(triangles[1]);
      stage.removeChild(triangles[2]);

      return triangles[0];
    } else if (triangles.constructor === Array) {
      return triangles.map(merge);
    }
    return triangles;
  }
}
