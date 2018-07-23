/* eslint-disable */

// Avoid `console` errors in browsers that lack a console.
var method;
var noop = function noop() {};
var methods = [
    'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
    'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
    'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
    'timeStamp', 'trace', 'warn'
];
var length = methods.length;
var console = (window.console = window.console || {});

while (length--) {
    method = methods[length];

    // Only stub undefined methods.
    if (!console[method]) {
        console[method] = noop;
    }

    // http://stackoverflow.com/questions/5538972/console-log-apply-not-working-in-ie9
    if (Function.prototype.bind && window.console && typeof console.log === 'object') {
        var that = Function.prototype.call;
        console[method] = that.bind(console[method], console);
    }
}
