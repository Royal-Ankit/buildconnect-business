/* NIRMAZA service worker: always tries the network first (so updates show at once), falls back to the saved copy when offline. */
var CACHE = 'bc-business-v1';
self.addEventListener('install', function (e) { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(caches.keys().then(function (k) { return Promise.all(k.filter(function (n) { return n !== CACHE; }).map(function (n) { return caches.delete(n); })); }).then(function () { return self.clients.claim(); })); });
self.addEventListener('fetch', function (e) {
  var r = e.request; if (r.method !== 'GET') return;
  var u = new URL(r.url); if (u.origin !== location.origin) return;          // never touch the database or other sites
  if (/config\.js$/.test(u.pathname)) return;
  e.respondWith(fetch(r).then(function (res) { if (res && res.ok) { var c = res.clone(); caches.open(CACHE).then(function (ch) { ch.put(r, c); }); } return res; }).catch(function () { return caches.match(r).then(function (m) { return m || (r.mode === 'navigate' ? caches.match('index.html') : undefined); }); }));
});
