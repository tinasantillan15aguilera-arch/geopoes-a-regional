/* ==========================================
   SERVICE WORKER (sw.js) - Recorrido Geopoético (Versión 2)
   ========================================== */

const VERSION = "v2"; // <--- Actualizado a versión 2 como pediste
const ARCHIVOS = [
    "./",
    "./index.html",
    "./styles.css",
    "./app.js",
    "./manifest.json",
    "./icono-192.png",
    "./icono-512.png"
];

// 1. EVENTO INSTALL: Guarda los archivos de la nueva versión
self.addEventListener("install", (evento) => {
    evento.waitUntil(
        caches.open(VERSION).then((cache) => {
            return cache.addAll(ARCHIVOS);
        })
    );
    self.skipWaiting();
});

// 2. EVENTO ACTIVATE: Borra la caché vieja (la versión anterior)
self.addEventListener("activate", (evento) => {
    evento.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== VERSION) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// 3. EVENTO FETCH: Responde con la caché o busca en la red
self.addEventListener("fetch", (evento) => {
    evento.respondWith(
        caches.match(evento.request).then((respuestaCaché) => {
            if (respuestaCaché) {
                return respuestaCaché;
            }
            return fetch(evento.request);
        })
    );
});