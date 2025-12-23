// TESOURA - Service Worker ESTÁVEL (SEM CACHE)
// Objetivo: impedir que versões antigas travem o site.

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    try{
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));
    }catch(e){}
    await self.clients.claim();
  })());
});

// Sempre rede (não armazena cache)
self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});
