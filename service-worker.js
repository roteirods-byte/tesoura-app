/* TESOURA - service worker (SAFE NO-CACHE)
   Motivo: evitar travas e cache velho no GitHub Pages.
   Versão: 2025-12-27_noiframe_v5
*/
const VERSION = "2025-12-27_noiframe_v5";

self.addEventListener("install", (event) => {
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

// Sem cache: deixa o navegador buscar sempre do servidor
self.addEventListener("fetch", (event) => {
  return; // passthrough
});
