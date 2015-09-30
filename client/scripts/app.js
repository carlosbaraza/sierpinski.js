/**
 * @file Main file.
 * @description This module imports everything and orquestates the single
 * page app.
 * @module app
 */

import _ from 'lodash';
import { renderer, stage, bg } from './stage';
import { animate } from './animate';
animate();

import { zoomAndPanStart, menuHamburgerSetup } from './interactions';
zoomAndPanStart(stage, renderer);
menuHamburgerSetup(stage, bg);

// Rudimentary loading handler. ToDo: Implement real loading state track.
setTimeout(() => {
  var loadingEl = document.getElementById('loading');
  loadingEl.classList.add('fade-out');
  setTimeout(() => loadingEl.style.display = "none", 500);
}, 1000);

// Debugging globals
import {} from './lib/angry-sierpinski';
window.renderer = renderer;
window.stage = stage;
window.bg = bg;
window._ = _;
