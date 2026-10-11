// Improvisator service worker: makes the app open and work offline after the first visit.
//
// Strategy: stale-while-revalidate. Every request is answered from the cache straight away,
// and the cache is refreshed in the background. An edit to valeurs.txt or index.html
// therefore shows up the next time the app is opened with a connection.

const CACHE = 'improvisator-v2';
const SHELL = [
  './',
  './index.html',
  './valeurs.txt',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
];
const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(SHELL.map((url) => new Request(url, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  const sameOrigin = url.origin === self.location.origin;
  if (!sameOrigin && !FONT_HOSTS.includes(url.hostname)) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(request, { ignoreSearch: sameOrigin });
    // Same-origin files are revalidated with the server (cheap 304 when unchanged).
    const network = (sameOrigin ? fetch(request.url, { cache: 'no-cache' }) : fetch(request))
      .then((response) => {
        if (response.ok || response.type === 'opaque') cache.put(request, response.clone());
        return response;
      });
    if (cached) {
      event.waitUntil(network.catch(() => {}));
      return cached;
    }
    return network;
  })());
});
