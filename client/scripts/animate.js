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
  if (frameCount % 15 == 0) cull();

  renderer.render(stage);

  if (frameCount > 60) frameCount = 0; // Reset counter every 60 frames.
  if (stats) stats.end();
}


// Debugging
window.triangles = triangles;
window.splitTriangles = splitTriangles;
window.mergeTriangles = mergeTriangles;
