/**
 * @file Library with functions to draw
 * @description Library with functions to draw
 * @module lib/draw
 */

import _ from 'lodash';

/**
 * Build PIXI.Graphics with triangle shape
 * @param  {Object} opts - Options for the triangle build.
 * @param  {Number} opts.base - Triangle width/base.
 * @param  {Number} opts.x - Initial X position.
 * @param  {Number} opts.y - Initial Y position.
 * @param  {Object} opts.scale - Equivalent to `PIXI.Graphics.scale`
 * @param  {Number} opts.scale.x - x scale.
 * @param  {Number} opts.scale.y - y scale.
 * @param  {Object} opts.visible - Will the element be visible initially.
 * @return {PIXI.Graphics} Triangle object that could be added to PIXI stage.
 */
export function triangle(opts) {
  var position = new PIXI.Point(opts.x || 0, opts.y || 0);
  opts.scale = opts.scale || {};
  var scale = new PIXI.Point(opts.scale.x || 1, opts.scale.y || 1);

  var graphics = new PIXI.Graphics();

  // Fill style: White by default.
  graphics.beginFill(0xFFFFFF);

  // Draw equilateral triangle shape
  graphics.moveTo(0, 0);
  graphics.lineTo(opts.base, 0);
  graphics.lineTo(opts.base / 2, -opts.base * 0.866025);
  graphics.lineTo(0, 0);
  graphics.endFill();

  graphics.position = position;
  graphics.scale = scale;
  if (opts.visible !== undefined) graphics.visible = opts.visible;

  return graphics;
}
