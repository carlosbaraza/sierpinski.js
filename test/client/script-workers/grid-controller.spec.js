import { debug } from '../../../client/scripts-workers/grid-controller.js';

describe('Sierpinski Worker', () => {
  var config;
  beforeEach(() => {
    config = { canvasHeight: 500, canvasWidth: 500 };
    postMessage(JSON.stringify({
      type: 'setConfig',
      data: config
    }));
  });

  it('allows setting configuration', () => {
    expect(debug.getConfig()).toEqual(config);
  });

  it('respond with visible children after updating configuration', () => {
    var msg = JSON.parse(window.postMessage.calls.mostRecent().args[0]);
    expect(msg.data.length).toBe(3);
  });

  it('allows request of new state', () => {
    postMessage(JSON.stringify({
      type: 'digest'
    }));
    var msg = JSON.parse(window.postMessage.calls.mostRecent().args[0]);
    expect(msg.type).toBe('update');
    expect(msg.data.length).toBe(9);
  });

  afterEach(() => {
    debug.reset();
  });
});

/******************************************************************************/
// Helpers
/******************************************************************************/

/**
 * Mock postMessage to worker
 */
function postMessage(message) {
  var messageEvent = { data: message } // Mock MessageEvent
  onmessage(messageEvent);
}

/**
 * Mock postMessage to main thread
 */
window.postMessage = jasmine.createSpy('postMessage');
