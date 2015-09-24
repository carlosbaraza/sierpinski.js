/******************************************************************************/
// Animate the stage
/******************************************************************************/

import { renderer, stage, cull } from './stage';
import { triangles, splitTriangles, mergeTriangles } from './init';
import { stats } from './lib/stats';

export { animate };

var frameCount = 0;

function animate() {
  if (stats) stats.begin();
  frameCount++;

  requestAnimationFrame(animate);

  // Every 15 frames, hide elements out of the view.
  if (frameCount % 15 === 0) cull();

  // Divide visible triangles every 15 seconds. Fit 90 triangles screen.
  if (frameCount % 15 === 0) splitTriangles(renderer.width / 70);

  // Merge triangles that are wider than 1/90*ViewPortWidth
  if (frameCount % 15 === 0) mergeTriangles(renderer.width / 90);

  renderer.render(stage);

  if (frameCount > 60) frameCount = 0; // Reset counter every 60 frames.
  if (stats) stats.end();
}


// Debugging
window.triangles = triangles;
window.splitTriangles = splitTriangles;
window.mergeTriangles = mergeTriangles;
