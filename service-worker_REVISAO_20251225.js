// TESOURA - Service Worker ESTÁVEL (SEM CACHE)
// Objetivo: evitar "versão antiga" por cache do navegador/GitHub Pages.

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // limpa caches antigos, se existirem
    try{
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));
    }catch(e){}
    try{ await self.clients.claim(); }catch(e){}
  })());
});

// Sempre busca na rede, sem usar HTTP cache
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // força "no-store" somente para requests do próprio domínio
  try{
    const url = new URL(req.url);
    if(req.method === 'GET' && url.origin === self.location.origin){
      const noStoreReq = new Request(req, { cache: 'no-store' });
      event.respondWith(fetch(noStoreReq));
      return;
    }
  }catch(e){}

  event.respondWith(fetch(req));
});
