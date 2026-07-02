const CACHE_VERSION = "solon-springs-2026-07-02-cabin-arrival";

self.addEventListener("install", event => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(name => name !== CACHE_VERSION).map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);

  if (url.origin !== location.origin) return;

  if (request.mode === "navigate" || request.destination === "document") {
    event.respondWith(fetch(request, { cache: "reload" }).catch(() => caches.match(request)));
    return;
  }

  if (["image", "script", "style", "manifest"].includes(request.destination)) {
    event.respondWith(fetch(request, { cache: "reload" }).catch(() => caches.match(request)));
  }
});
