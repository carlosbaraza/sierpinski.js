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

export { renderer, stage, cull };


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

function cull() {
  for (var i = 0; i < stage.children.length; i++)
    stage.children[i].visible = !isOutOfCanvas(stage.children[i].position);
}

function isOutOfCanvas(point) {
  var canvasX = stage.x + point.x * stage.scale.x;
  var canvasY = stage.y + point.y * stage.scale.y;

  // Use .5*ViewPortSize margin
  if (canvasX < -renderer.width /2 || canvasX > renderer.width *1.5 ||
      canvasY < -renderer.height/2 || canvasY > renderer.height*1.5) return true;
  return false;
}
