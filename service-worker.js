self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("luan-financeiro").then(cache =>
      cache.addAll(["/","/index.html","/venda.html"])
    )
  );
});
self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
