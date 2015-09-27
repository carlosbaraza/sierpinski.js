/**
 * @file Main file.
 * @description This module imports everything and orquestates the single
 * page app.
 * @module app
 */

import _ from 'lodash';
import { renderer, stage } from './stage';
import { animate } from './animate';
animate();

import { zoomAndPanStart } from './interactions';
zoomAndPanStart(stage, renderer);

// Debugging globals
window.renderer = renderer;
window.stage = stage;
window._ = _;
