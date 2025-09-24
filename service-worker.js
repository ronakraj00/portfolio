const CACHE_NAME = "portfolio-cache-v3";
const ASSETS_TO_CACHE = [
  "./index.html",
  "./style.css",
  "./game.css",
  "./game.js",
  "./icon.png",
  "./manifest.json",
  "./image.png",
  "./image2.png",
  "./image3.png",
  "./image5.png",
  "./image6.png",
  "./fluid.js",
  "./newsletter-simulation.js",
  "./projects-simulation.js",
  "./games-simulation.js",
  "./links.js",
  "./resume_ronak_raj.html",
  "./service-worker.js",
  "./stars.js",
];

// Install event: cache all assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

// Activate event: clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
  );
  self.clients.claim();
});

// Fetch event: serve from cache, fall back to network, fallback to offline page if needed
self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      caches
        .match("./index.html")
        .then((cached) => cached || fetch(event.request))
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
