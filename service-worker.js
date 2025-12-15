/* REV: 7 | Service Worker NEUTRO (sem cache)
   Objetivo: evitar travamento/versão antiga. */

self.addEventListener("install", (event) => {
  // ativa imediatamente
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    // apaga QUALQUER cache antigo
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

// SEM cache: sempre busca na internet
self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});
