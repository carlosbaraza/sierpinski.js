/**
 * @file Grid constructor. See {@link Grid}
 * @description See {@link Grid} for further information.
 * @module workers/grid
 */

import _ from 'lodash';

/**
 * Collection that keeps track of current objects. Updates the structure when
 * divisions or merges are needed.
 * @constructor
 * @param {Grid} cfg - Configuration object. {@link Grid.setConfig} for
 * further information.
 * @see {@link Grid.setConfig} for further information.
 */
export function Grid(cfg) {
  this.setConfig(cfg);

  /**
   * Accessed through {@link Grid._getGrid} and {@link Grid._setGrid}
   * closures to avoid having references to old _grid array versions that could
   * not be garbage collected. As this object may be memory consuming,
   * this is needed.
   * @type {Array[]}
   * @access private
   */
  var _grid = buildMasterTriangle(this._config);

  /**
   * Get private _grid.
   * @return {Array[]} {@link Grid~_grid}
   */
  this._getGrid = function _getGrid() { return _grid; };

  /**
   * Set private _grid.
   * @param {Array[]} newGrid - {@link Grid~_grid} for further information.
   */
  this._setGrid = function _setGrid(newGrid) { _grid = newGrid; };
}

/**
 * Set config for Grid instance. Performs sanity checks and merge the given
 * properties with possible already existing properties in the config object.
 * @memberof Grid
 * @method setConfig
 * @param {Object} cfg - Config object which look available properties are:
 * @param {Number} cfg.canvasHeight - Canvas element height
 * @param {Number} cfg.canvasWidth - Canvas element width
 * @param {Object} cfg.scale - Scale (Zoom), usually of PIXI.Stage.scale object
 * @param {Number} cfg.scale.x=1 - Scale (Zoom) X axis
 * @param {Number} cfg.scale.y=1 - Scale (Zoom) Y axis
 * @param {Object} cfg.position - Viewport position, usually PIXI.Stage.position
 * @param {Number} cfg.position.x=0 - Viewport X position
 * @param {Number} cfg.position.y=0 - Viewport Y position
 * @param {Number} cfg.mergeNarrowerThan=10 - Maximum width for objects in view.
 * @param {Number} cfg.splitWiderThan=50 - Minimum width for objects in view.
 * @throws {TypeError} If configuration object is missing.
 */
Grid.prototype.setConfig = function setConfig(cfg) {
  if (!cfg) throw TypeError(_ERROR.missingConfig);
  /**
   * Configuration object used to track current state of the viewport.
   * @type {Object}
   * @memberof Grid
   * @name _config
   * @inner
   */
  this._config = this._config || {};

  /* Default values for config */
  var defaultCfg = {
    position:           {x: 0, y: 0},
    scale:              {x: 1, y: 1},
    mergeNarrowerThan:  10,
    splitWiderThan:     50,
  };
  for (let key in defaultCfg)
    if (defaultCfg.hasOwnProperty(key)) this._config[key] = defaultCfg[key];

  this._configSanityChecks(cfg);

  for (let key in cfg)
    if (cfg.hasOwnProperty(key)) this._config[key] = cfg[key];
};

/**
 * Check if needed properties exists either in {@link Grid~_config} or in param.
 * @param  {Object} cfg - Optional config object to check, instead of
 * {@link Grid~_config}
 * @throws {Error} Throws error with missing property in the config.
 */
Grid.prototype._configSanityChecks = function _configSanityChecks(cfg = []) {
  [ 'canvasWidth',
    'canvasHeight',
    'scale',
    'position',
    'mergeNarrowerThan',
    'splitWiderThan'
  ].forEach((property) => {
    if (!this._config[property] && !cfg[property])
      throw new Error(_ERROR.missingProperty + '\'' + property + '\'');
  });
};

/**
 * Get all the visible children and flatten the results. This will be stringify
 * in JSON and sent to the main thread.
 * @return {Array} Visible children
 */
Grid.prototype.getChildrenVisibleFlatten = function getChildrenVisibleFlatten(){
  return _.filter(_.flattenDeep(this._getGrid()), (child) => child.visible);
};

/**
 * Culling is the fact of hiding objects which are not visible, in order to
 * accelerate the rendering. This method will hide any objects out of the
 * viewport and show any object that newly entered to the viewport.
 */
Grid.prototype.cull = function () {
  var isOutOfCanvas = (x, y) => {
    var absX = this._config.position.x + x * this._config.scale.x;
    var absY = this._config.position.y + y * this._config.scale.y;

    // Use .5*ViewPortSize margin
    if (absX < -this._config.canvasWidth / 2   ||
        absX >  this._config.canvasWidth * 1.5 ||
        absY < -this._config.canvasHeight / 2  ||
        absY >  this._config.canvasHeight * 1.5 ) return true;

    return false;
  };

  this._setGrid(
    this._getGrid().map(function findChildren(obj) {
      if (obj.constructor === Array) return obj.map(findChildren);
      obj.visible = !isOutOfCanvas(obj.x, obj.y);
      return obj;
    })
  );
};

/**
 * Split visible triangles wider than _config.splitWiderThan.
 * @see {@link Grid.setConfig}
 */
Grid.prototype.splitChildren = function splitChildren() {
  var splitWiderThan = this._config.splitWiderThan || 0;
  var isSplitable = (tr) => tr.width * this._config.scale.x > splitWiderThan;

  var that = this;
  this._setGrid(
    this._getGrid().map(function findSplitableTriangles(obj) {
      if (obj.constructor === Array)
        return obj.map(findSplitableTriangles);
      if (!obj.visible) return obj;
      if (isSplitable(obj)) {
        return splitChild(obj);
      }
      return obj;
    })
  );
};

/**
 * Merge objects narrower than _config.mergeNarrowerThan
 * @see {@link Grid.setConfig}
 */
Grid.prototype.mergeChildren = function mergeChildren() {
  var that = this;
  return this._setGrid(
    this._getGrid().map(function findMergeableTriangles(obj) {
      if (obj.constructor === Array && thereArentArrays(obj)) {
        if (allNarrowerThanMaximum(obj)) return merge(obj);
        return obj;
      }
      if (obj.constructor === Array) return obj.map(findMergeableTriangles);
      return obj;
    })
  );

  function thereArentArrays(objs) { return _.every(objs, notArray); }
  function notArray(obj) { return obj.constructor !== Array; }
  function merge(children) {
    children[0].width *= 2;
    children[0].height *= 2;
    return children[0];
  }
  function allNarrowerThanMaximum(children) {
    return _.every(children, (tr) => {
      return tr.width * that._config.scale.x < that._config.mergeNarrowerThan;
    });
  }
};

/**
 * Count current objects. Both visible and not visible. The result is stored in
 * {@link Grid~_lastCount}.
 * @return {Number} {@link Grid~_lastCount}
 */
Grid.prototype._countObjects = function _countObjects() {
  var count = 0;

  this._getGrid().forEach(function recursiveCount(obj) {
    if (obj.constructor === Array)
      return obj.map(recursiveCount);
    return count++;
  });

  /**
   * Last count of objects number, both visible and hidden.
   * @type {Number}
   * @memberof Grid
   * @name _lastCount
   * @inner
   */
  this._lastCount = count;
  return this._lastCount;
};


/******************************************************************************/
// Private to module
/******************************************************************************/

var _ERROR = {
  missingConfig: 'The first param should be a configuration object',
  missingProperty: 'The configuration object should include property '
};

var _SIN60 = Math.sin(Math.PI / 180 * 60);

function buildMasterTriangle(config) {
  var base = config.canvasWidth;
  var height = base * _SIN60;
  return [{
    x: 0,
    y: config.canvasHeight / 2 + height / 2,
    width: base,
    height: height,
    visible: true
  }];
}

function splitChild(child) {
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
