import _ from 'lodash';
import { renderer, stage } from './stage';
import { animate } from './animate';
animate();

// Debugging globals
window.renderer = renderer;
window.stage = stage;
window._ = _;
