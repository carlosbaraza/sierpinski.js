/**
 * @file Shared file between workers and main thread. Encapsulates sierpinski
 * split and merge logic.
 * @description Shared file between workers and main thread. Encapsulates sierpinski
 * split and merge logic.
 * @module lib/sierpinski-utils
 */

/**
 * Sin(60 degrees) to cache the result and avoid repeating the calculation.
 */
export var _SIN60 = Math.sin(Math.PI / 180 * 60);

/**
 * Builds a master element with the width set to given param and height set
 * to base * sin(60deg)
 * @param  {Number} base - width of the object
 * @return {Object[]} Array containing one element with described properties
 */
export function buildMasterTriangle(base) {
  var height = base * _SIN60;
  return [{
    x: 0,
    y: 0,
    width: base,
    height: height,
    visible: true
  }];
}

/**
 * Splits an element into three elements. This is the basic operation for
 * constructing the Sierpinski Triangle
 * @param  {Object} child - Object to be splitted
 * @param  {Number} child.width - width will be divided by 2
 * @param  {Number} child.height - height will be divided by 2
 * @param  {Number} child.x
 * @param  {Number} child.y
 * @param  {Boolean} child.visible - is the current element visible
 * @return {Object[]} Array with three cloned objects, two in the base, side by
 * side; and one above them, in between both.
 */
export function splitChild(child) {
  child.width *= 0.5;
  child.height *= 0.5;

  var newChild1 = {
    x: child.x + child.width,
    y: child.y,
    width: child.width,
    height: child.height,
    visible: true
  };

  var newChild2 = {
    x: child.x + child.width / 2,
    y: child.y - child.width * _SIN60,
    width: child.width,
    height: child.height,
    visible: true
  };

  return [child, newChild1, newChild2];
}
