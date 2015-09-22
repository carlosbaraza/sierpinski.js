/******************************************************************************/
// Animate the stage
/******************************************************************************/

import { renderer, stage } from './stage';
import { triangles } from './init';
import { stats } from './lib/stats';

function animate() {
  if (stats) stats.begin();

  requestAnimationFrame(animate);
  renderer.render(stage);

  if (stats) stats.end();
}

export { animate };
