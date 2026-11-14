/* ==========================================
   SERVICE WORKER (sw.js) - Recorrido Geopoético
   ========================================== */

const VERSION = "v1";
const ARCHIVOS = [
    "./",
    "./index.html",
    "./styles.css",
    "./app.js",
    "./manifest.json",
    "./icono-192.png",
    "./icono-512.png"
];

// 1. EVENTO INSTALL: Guarda una copia de todos los archivos en la caché la primera vez
self.addEventListener("install", (evento) => {
    evento.waitUntil(
        caches.open(VERSION).then((cache) => {
            return cache.addAll(ARCHIVOS);
        })
    );
    self.skipWaiting();
});

// 2. EVENTO ACTIVATE: Borra las cachés de versiones anteriores cuando actualizás la app
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

// 3. EVENTO FETCH: Responde primero con la copia guardada en caché y, si no está, busca en la red
self.addEventListener("fetch", (evento) => {
    evento.respondWith(
        caches.match(evento.request).then((respuestaCaché) => {
            if (respuestaCaché) {
                return respuestaCaché; // Entrega la copia guardada (funciona offline)
            }
            return fetch(evento.request); // Si no está en caché, va a la red
        })
    );
});