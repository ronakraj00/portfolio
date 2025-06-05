const cacheName = "ronak-resume-v1";
const filesToCache = [
  "/",
  "/index.html",
  "/resume_ronak_raj.html",
  "/manifest.json",
  "/icon.png",
  "profile_me_picture_2.jpg",
  "/css-pattern-by-magicpattern_box.png",
  "/css-pattern-by-magicpattern_cube.png",
  "/css-pattern-by-magicpattern_diagonal.png",
  "/css-pattern-by-magicpattern_lines.png",
  "/css-pattern-by-magicpattern.png",
  "game.css",
  "game.js",
];

self.addEventListener("install", (e) => {
  if (location.hostname === "localhost") {
    self.skipWaiting();
    return;
  }
  e.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener("fetch", (e) => {
  if (location.hostname === "localhost") {
    return fetch(e.request); // Bypass cache in dev
  }
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
