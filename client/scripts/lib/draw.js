/******************************************************************************/
// Library with functions to draw
/******************************************************************************/

import _ from 'lodash';
import { graphics } from '../init';

// Build PIXI.Graphics with triangle shape
export function triangle(opts) {
  // TODO: Find a more efficient way to render a triangle. Maybe using directly
  // WebGL API.

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

  return graphics;
}
