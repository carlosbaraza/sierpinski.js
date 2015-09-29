/**
 * @file Library with functions to draw
 * @description Library with functions to draw
 * @module lib/draw
 */

import _ from 'lodash';
import { _SIN60, splitChild, buildMasterTriangle } from './sierpinski-utils';

/**
 * Build PIXI.Graphics with Sierpinski Triangle shape
 * @param  {Object} opts - Options for the triangle build.
 * @param  {Number} opts.base - Triangle width/base.
 * @param  {Number} opts.x=0 - Initial X position.
 * @param  {Number} opts.y=0 - Initial Y position.
 * @param  {Object} opts.scale - Equivalent to `PIXI.Graphics.scale`
 * @param  {Number} opts.scale.x=1 - x scale.
 * @param  {Number} opts.scale.y=1 - y scale.
 * @param  {Boolean} opts.visible=true - Will the element be visible initially.
 * @return {PIXI.Graphics} Triangle object that could be added to PIXI stage.
 */
export function sierpinskiTriangle(opts) {
  var position = new PIXI.Point(opts.x || 0, opts.y || 0),
      scale = opts.scale || {x: 1, y: 1};
  scale = new PIXI.Point(scale.x, scale.y);

  // Build Sierpinski Triangle elements (81 triangles)
  var triangles = buildMasterTriangle(opts.base);
  for (var i = 0; i < 4; i++) // 3^4 = 81 objects at the end
    triangles = _splitChildren(triangles);

  /** Draw Triangle */
  var graphics = new PIXI.Graphics();
  graphics.beginFill(0xFFFFFF); // White
  _drawTriangles(graphics, triangles);
  graphics.endFill();

  graphics.position = position;
  graphics.scale = scale;
  if (opts.visible !== undefined) graphics.visible = opts.visible;

  return graphics;
}

export function _splitChildren(triangles) {
  return triangles.map(function findSplitableTriangles(obj) {
    if (obj.constructor === Array)
      return obj.map(findSplitableTriangles);
    return splitChild(obj);
  });
}

export function _drawTriangles(graphics, triangles) {
  _.each(_.flattenDeep(triangles), (tr) => {
    // Draw equilateral triangle shape
    graphics.moveTo(tr.x, tr.y);
    graphics.lineTo(tr.x + tr.width, tr.y);
    graphics.lineTo(tr.x + tr.width / 2, tr.y - tr.height);
    graphics.lineTo(tr.x, tr.y);
  });
}
