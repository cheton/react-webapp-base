/* eslint-disable */

if (!global._babelPolyfill) {
    // Babel polyfill
    require('babel-polyfill');
}

// console (IE9)
require('./console');

// ES5
require('es5-shim/es5-shim');
require('es5-shim/es5-sham');

// web.js includes the most common Web polyfills - it assumes ES2015 support
require('imports-loader?self=>window!js-polyfills/html');
require('./nodes');

// Placeholder polyfill
require('./placeholders');
