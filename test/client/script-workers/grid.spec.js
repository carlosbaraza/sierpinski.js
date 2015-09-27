import { Grid } from '../../../client/scripts-workers/grid.js';

describe('Grid', () => {
  var grid;
  beforeEach(() => grid = new Grid(_configFixture));

  it('needs initial configuration', () => {
    expect(() => new Grid()).toThrowError(TypeError, /configuration/);
    expect(() => new Grid({})).toThrowError(/canvasWidth/);
  });

  it('has one child initially', () => {
    expect(grid._getGrid().length).toBe(1);
  });

  it('builds the initial triangle with canvasWidth and centered', () => {
    var grid = new Grid(_configFixture);
    expect(grid._getGrid()[0].width).toBe(_configFixture.canvasWidth);
    expect(grid._getGrid()[0].y).toBeCloseTo(70, -1); // (1-sin(60deg))/2*height
  });

  describe('children culling', () => {
    it('hides children out of the viewport', () => {
      grid.setConfig({ scale: {x: 8, y: 8} });
      grid.cull();
      expect(grid._countObjects()).toBe(1);
    });
  });

  describe('splits', () => {
    it('splits the master object in three objects', () => {
      grid.splitChildren();
      expect(grid._getGrid()[0].length).toBe(3);
    });

    it('splits only the visible objects', () => {
      grid.splitChildren(); // 1 visible object becomes 3

      var newGrid = grid._getGrid();
      newGrid[0][0].visible = false;
      grid._setGrid(newGrid);
      grid.splitChildren(); // 2 visible objects become 6 + 1 non visible = 7

      expect(grid._countObjects()).toBe(7);
    });
  });

  describe('merge', () => {
    beforeEach(() => {
      grid.splitChildren(); // 1 visible object becomes 3
      grid.splitChildren(); // 3 visible object becomes 9
      grid.splitChildren(); // 9 -> 27, width = 125 < mergeNarrowerThan=200
    });

    it('merges narrower objects for current viewport scale', () => {
      grid.mergeChildren();
      expect(grid._countObjects()).toBe(9);
    });
  });
});

var _configFixture = {
  canvasWidth: 1000,
  canvasHeight: 1000,
  position: {x: 0, y: 0},
  scale: {x: 0.95, y: 0.95},
  mergeNarrowerThan: 200,
  splitWiderThan: 200
};
