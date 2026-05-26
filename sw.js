const CACHE_NAME = "papeo-carta-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./ensaladas.html",
  "./raciones.html",
  "./tablas-variadas.html",
  "./cazuelitas.html",
  "./bocadillos-frios.html",
  "./bocadillos-calientes.html",
  "./ingredientes-adicionales.html",
  "./vinos-bebidas.html",
  "./postres.html",
  "./css/style.css",
  "./js/main.js",
  "./manifest.webmanifest",
  "./img/logo.png",
  "./img/icon-192.png",
  "./img/icon-512.png",
  "./img/local/local-01-bar.webp"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      });
    })
  );
});
