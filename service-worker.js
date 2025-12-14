const CACHE = "tesoura-v2-cache-1";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./app/css/ui.css",
  "./app/js/config.js",
  "./app/js/supabaseClient.js",
  "./app/js/auth.js",
  "./app/js/app.js",
  "./app/js/panels/controle_geral.js",
  "./app/js/panels/mensalidade.js",
  "./app/js/panels/caixa.js",
  "./app/js/panels/gols.js",
  "./app/js/panels/banco_dados.js",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE ? caches.delete(k) : null)))
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  e.respondWith(
    caches.match(req).then((cached) => cached || fetch(req).catch(() => caches.match("./index.html")))
  );
});