// TESOURA SW (desativado): evita cache travando versões.
self.addEventListener('install', (e)=>{ self.skipWaiting(); });
self.addEventListener('activate', (e)=>{
  e.waitUntil((async()=>{
    try{ const keys = await caches.keys(); for(const k of keys){ await caches.delete(k); } }catch(e){}
    try{ await self.clients.claim(); }catch(e){}
  })());
});
self.addEventListener('fetch', (e)=>{
  // NÃO intercepta nada.
});
