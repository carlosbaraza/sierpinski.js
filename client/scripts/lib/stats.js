/******************************************************************************/
// Stats.js (Monitor FPS and render time)
/******************************************************************************/

export var stats = new Stats();
stats.setMode( 0 ); // 0: fps, 1: ms, 2: mb

// Top left alignment
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';

document.body.appendChild( stats.domElement );
