/**
 * @file Stats.js configuration.
 * @description Stats.js configuration. Monitor FPS and render time.
 * @module lib/stats
 */

export var stats = new Stats();
stats.setMode( 0 ); // 0: fps, 1: ms, 2: mb

document.getElementById('nav-stats').appendChild( stats.domElement );
