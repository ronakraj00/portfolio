const CACHE_NAME = "portfolio-cache-v2";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/style.css",
  "/game.css",
  "/game.js",
  "/icon.png",
  "/manifest.json",
  // Add all images used in your HTML
  "/profile_me_picture_2.jpg",
  "/image.png",
  "/image2.png",
  "/image3.png",
  "/image5.png",
  "/image6.png",
  // Add any other assets you want to cache
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css",
  // Cache CSS patterns for backgrounds (actual file names)
  "/css-pattern-by-magicpattern.png",
  "/css-pattern-by-magicpattern_box.png",
  "/css-pattern-by-magicpattern_lines.png",
  "/css-pattern-by-magicpattern_diagonal.png",
  "/css-pattern-by-magicpattern_bw.png",
  // ...add more if you have more pattern files
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
    // For navigation requests, always serve index.html from cache
    event.respondWith(
      caches
        .match("/index.html")
        .then((response) => response || fetch(event.request))
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).then((fetchRes) => {
          // Optionally cache new requests here if needed
          return fetchRes;
        })
      );
    })
  );
});
