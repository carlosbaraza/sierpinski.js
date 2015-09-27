/**
 * @file Custom cross-browser implementation of wheelListener
 * @description Custom cross-browser implementation of wheelListener
 * @module lib/wheelListener
 */

var prefix = "",
    addEventListener = detectEventModel(),
    onwheel,
    support = availableWheelEvent();

export function addWheelListener(el, callback, useCapture) {
  _addWheelListener(el, support, callback, useCapture);

  // Older Firefox
  if (support == 'DOMMouseScroll')
    _addWheelListener(el, 'MozMousePixelScroll', callback, useCapture);
}

function _addWheelListener(el, eventName, callback, useCapture) {
  el[addEventListener](prefix + eventName, getCallback(), useCapture || false);

  function getCallback() {
    if (support == 'wheel') return callback;

    return (originalEvent) => {
      if (!originalEvent) originalEvent = window.event;

      // Create a normalized event object
      var event = {
        originalEvent: originalEvent, // keep a ref to the original event object
        target: originalEvent.target || originalEvent.srcElement,
        type: 'wheel',
        deltaMode: originalEvent.type == 'MozMousePixelScroll' ? 0 : 1,
        deltaX: 0,
        delatZ: 0,
        preventDefault: () => {
          if (originalEvent.preventDefault)
            return originalEvent.preventDefault();

          originalEvent.returnValue = false;
          return originalEvent;
        }
      };

      // Calculate deltaY (and deltaX) according to the event
      if ( support == 'mousewheel' ) {
        event.deltaY = - 1/40 * originalEvent.wheelDelta;
        // Webkit also support wheelDeltaX
        if (originalEvent.wheelDeltaX)
          event.deltaX = - 1/40 * originalEvent.wheelDeltaX;
      } else {
        event.deltaY = originalEvent.detail;
      }

      // Fire the callback
      return callback(event);
    };
  }
}

function detectEventModel() {
  if (window.addEventListener) {
    return 'addEventListener';
  } else {
    prefix = 'on';
    return 'attachEvent';
  }
}

function availableWheelEvent() {
  // Modern browsers support "wheel"
  if ("onwheel" in document.createElement("div")) return 'wheel';

  // Webkit and IE support at least "mousewheel"
  if (document.onmousewheel !== undefined) return 'mousewheel';

  // let's assume that remaining browsers are older Firefox
  return 'DOMMouseScroll';
}
