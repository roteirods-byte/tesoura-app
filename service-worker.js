// service-worker.js
// REV: 4

const CACHE_NAME = "tesoura-cache-v4";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./app/css/ui.css",
  "./app/js/config.js",
  "./app/js/supabaseClient.js",
  "./app/js/auth.js",
  "./app/js/app.js",
  "./app/js/panels/jogadores.js",
  "./app/js/panels/presenca_escalacao.js",
  "./app/js/panels/controle_geral.js",
  "./app/js/panels/mensalidade.js",
  "./app/js/panels/caixa.js",
  "./app/js/panels/gols.js",
  "./app/js/panels/banco_dados.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(ASSETS);
    self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => (k !== CACHE_NAME) ? caches.delete(k) : null));
    self.clients.claim();
  })());
});

// Navegação: rede primeiro (pra não prender em versão antiga)
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Ignorar CDN/Supabase
  if (url.origin !== location.origin) return;

  if (req.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(CACHE_NAME);
        cache.put("./index.html", fresh.clone());
        return fresh;
      } catch (e) {
        const cache = await caches.open(CACHE_NAME);
        return (await cache.match("./index.html")) || (await cache.match("./")) || Response.error();
      }
    })());
    return;
  }

  // Assets: cache-first (ignora ?v=)
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(req, { ignoreSearch: true });
    if (cached) return cached;
    const fresh = await fetch(req);
    cache.put(req, fresh.clone());
    return fresh;
  })());
});
