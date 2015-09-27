/**
 * @file Module that manages animation loop and canvas element update on each
 * frame as needed.
 * @description Animates the stage
 * @module animate
 */

import { renderer, stage } from './stage';
import { setConfig } from './grid';
import { stats } from './lib/stats';

export { animate };

var frameCount = 0,
    currentConfig;

/**
 * Animation loop executed on each frame.
 */
function animate() {
  if (stats) stats.begin();
  frameCount++;

  requestAnimationFrame(animate);

  currentConfig = {
    scale: stage.scale,
    position: stage.position
  };
  if (frameCount % 15 === 0) setConfig(currentConfig);

  renderer.render(stage);

  if (frameCount > 60) frameCount = 0; // Reset counter every 60 frames.
  if (stats) stats.end();
}
