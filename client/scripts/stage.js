/******************************************************************************/
// Stage / Canvas set up.
/******************************************************************************/

var canvas = getCanvas();
var renderer = new PIXI.WebGLRenderer(canvas.width, canvas.height, {
  view: canvas.el
});

window.onresize = resizePixiRenderer; // Update renderer size after resize.

var stage = new PIXI.Container();
stage.interactive = true;

export { renderer, stage };


function getCanvas() {
  var el = document.getElementById('canvas'),
      width = el.offsetWidth,
      height = el.offsetHeight;
  return { el, width, height };
}

function resizePixiRenderer() {
  var canvas = getCanvas();
  renderer.resize(canvas.width, canvas.height);
}
