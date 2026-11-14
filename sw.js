/* ==========================================
   SERVICE WORKER (sw.js) - Recorrido Geopoético (Versión 3 con Aviso)
   ========================================== */

const VERSION = "v3";
const ARCHIVOS = [
    "./",
    "./index.html",
    "./styles.css",
    "./app.js",
    "./manifest.json",
    "./icono-192.png",
    "./icono-512.png"
];

// 1. EVENTO INSTALL: Guarda los archivos pero NO salta la espera automáticamente
self.addEventListener("install", (evento) => {
    evento.waitUntil(
        caches.open(VERSION).then((cache) => {
            return cache.addAll(ARCHIVOS);
        })
    );
    // Quitamos self.skipWaiting() para que se quede esperando y dispare el aviso en app.js
});

// 2. EVENTO ACTIVATE: Borra las cachés de versiones anteriores
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