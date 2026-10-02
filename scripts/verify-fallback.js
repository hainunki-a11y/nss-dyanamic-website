const fs = require('fs');
const vm = require('vm');

// Read data.js
const src = fs.readFileSync(__dirname + '/../data.js', 'utf8');

// Stub browser globals
const context = {
  window: {},
  document: { querySelectorAll: () => [], querySelector: () => null, addEventListener: () => {}, createElement: () => ({ setAttribute: () => {}, appendChild: () => {}, style: {} }) },
  fetch: () => Promise.reject(new Error('offline')),
  AbortController: function () {},
  setTimeout: () => 0,
  clearTimeout: () => {},
  Promise: Promise,
  console: console,
  CustomEvent: function () { return {}; },
  Event: function () { return {}; }
};
context.window = context;
vm.createContext(context);
vm.runInContext(src, context);

// Now trigger the fallback path via getData (fetch rejects -> fallback)
context.window.NSS.getData().then(function (data) {
  console.log('FALLBACK loaded OK');
  console.log('Keys:', Object.keys(data));
  console.log('events 2025-26:', (data.events['2025-26'] || []).length);
  console.log('events 2026-27:', (data.events['2026-27'] || []).length);
  console.log('OK');
}).catch(function (e) {
  console.error('FALLBACK FAILED:', e && e.message);
  process.exit(1);
});
