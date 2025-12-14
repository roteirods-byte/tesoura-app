const CACHE = "tesoura-v2-cache-2"; // <-- troquei de 1 para 2 (força atualização)

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./service-worker.js",

  "./app/css/ui.css",

  "./app/js/config.js",
  "./app/js/supabaseClient.js",
  "./app/js/auth.js",
  "./app/js/app.js",

  // PANELS
  "./app/js/panels/jogadores.js",
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
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE ? caches.delete(k) : null)))
    )
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request))
  );
});
