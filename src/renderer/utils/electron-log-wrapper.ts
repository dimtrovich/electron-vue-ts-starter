// electron-log-wrapper.js

// This file acts as a wrapper to allow asynchronous dynamic import of `electron-log/renderer`.
// Since `electron-log/renderer` is a CommonJS module, it cannot be dynamically imported directly.
// By wrapping it here and re-exporting as an ES Module, we enable standard dynamic import behavior.

import log from 'electron-log/renderer';

// Re-export the module as default to make it compatible with dynamic import()
export default log;