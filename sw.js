const CACHE = "gym-attendance-v5";

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then(cache =>
      cache.addAll(["./", "./index.html", "./manifest.json"])
    )
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);
  if (url.pathname.endsWith("/index.html") || url.pathname.endsWith("/gym-attendance/") || url.pathname.endsWith("/sw.js")) {
    event.respondWith(fetch(event.request, {cache: "no-store"}).catch(() => caches.match("./index.html")));
    return;
  }
  event.respondWith(caches.match(event.request).then(r => r || fetch(event.request)));
});
