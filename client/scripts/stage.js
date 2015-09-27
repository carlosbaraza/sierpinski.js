/**
 * @module stage
 * @description This ES2015 module will set up the `PIXI.WebGLRenderer` and
 * `PIXI.Container` and export them. As ES2015 modules act like Singletons,
 * this module could be imported whenever it is needed access to the
 * `stage` and `renderer`.
 */

var canvas = getCanvas();
var renderer = new PIXI.WebGLRenderer(canvas.width, canvas.height, {
  view: canvas.el
});

/** Update renderer size after resize. */
window.onresize = resizePixiRenderer;

/**
 * Main container. It will be rendered by the renderer during the animate loop.
 */
var container = new PIXI.Container();

var stage = new PIXI.Container();
stage.interactive = true;

var bgSprite = PIXI.Sprite.fromImage('/client/images/nebula.jpeg');
var bg = new PIXI.Container();
bg.addChild(bgSprite);

container.addChild(bg);
container.addChild(stage);

export default {
  /** Exported `PIXI.WebGLRenderer` */
  renderer,
  /** Exported `PIXI.Container` */
  container,
  /** Exported `PIXI.DisplayObject` */
  stage,
  /** Exported `PIXI.DisplayObject` for background */
  bg
};


/******************************************************************************/
// Hoisted functions
/******************************************************************************/

/**
 * Find canvas DOM element
 * @return {Object} `{el: {CanvasDOMElement}, width: {Number}, height: {Number}}`
 */
function getCanvas() {
  var el = document.getElementById('canvas'),
      width = el.offsetWidth,
      height = el.offsetHeight;
  return { el, width, height };
}

/**
 * `window.onresize` event handler. Resizes the PIXI renderer to adjust to new
 * window size.
 */
function resizePixiRenderer() {
  var canvas = getCanvas();
  renderer.resize(canvas.width, canvas.height);
}
