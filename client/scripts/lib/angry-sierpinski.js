/******************************************************************************/
// What if all the triangles where very angry?
/******************************************************************************/

import _ from 'lodash';
import { _SIN60, splitChild, buildMasterTriangle } from './sierpinski-utils';
import { _splitChildren } from './draw';

var _originalTriangles = [];
var _birds = [];

window._angrySierpinski = function _angrySierpinski(reset = true) {
  var cacheLength = stage.children.length;

  for (let i = 0; i < cacheLength; i++) {
    _birds.push(angrySierpinski({
      x: window.stage.children[0].x,
      y: window.stage.children[0].y,
      base: window.stage.children[0].width,
      scale: window.stage.children[0].scale,
      visible: window.stage.children[0].visible
    }));
    _originalTriangles.push(window.stage.children[0]);
    window.stage.removeChild(window.stage.children[0]);
  }

  if (reset) resetStage();

  for (let i = 0; i < _birds.length; i++)
    window.stage.addChild(_birds[i]);
};

function resetStage() {
  window.scale = {x: 1, y: 1};
  window.position = {x: 0, y: 0};
}

window._calmSierpinski = function _calmSierpinski() {
  resetStage();

  window.stage.removeChildren();
  var _originalLength = _originalTriangles.length;
  for (let i = 0; i < _originalLength; i++)
    window.stage.addChild(_originalTriangles.shift());
};

document.getElementById('love').onclick = () => {
  if (window.stage) {
    if (_originalTriangles.length > 0) return window._calmSierpinski();
    return window._angrySierpinski();
  } else {
    console.log('If stage global is not present, Sierpinski is not angry...');
  }
};


/******************************************************************************/
// Angry draw helpers
/******************************************************************************/

export function angrySierpinski(opts) {
  var position = new PIXI.Point(opts.x || 0, opts.y || 0),
      iterations = opts.iterations || 2,
      scale = opts.scale || {x: 1, y: 1};
  scale = new PIXI.Point(scale.x, scale.y);

  var triangles = buildMasterTriangle(opts.base);
  for (var i = 0; i < iterations; i++) triangles = _splitChildren(triangles);

  var angryContainer = new PIXI.Container();
  _drawAngryBirds(angryContainer, triangles);

  angryContainer.position = position;
  angryContainer.scale = scale;
  if (opts.visible !== undefined) angryContainer.visible = opts.visible;

  return angryContainer;
}

function _drawAngryBirds(angryContainer, triangles) {
  _.each(_.flattenDeep(triangles), (triangle) => {
    angryContainer.addChild( angryBird(triangle) );
  });
}

export function angryBird(opts) {
  var _angryBird = PIXI.Sprite.fromImage('client/images/angry-bird.png');
  _angryBird.height = _angryBird.width * _SIN60;
  _angryBird.x = opts.x;
  _angryBird.y = opts.y + _angryBird.height - opts.height;
  _angryBird.width = opts.width;
  _angryBird.height = opts.height;
  return _angryBird;
}
