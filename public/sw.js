// Service worker per la PWA "UNIMIB Appunti".
// Strategia: network-first per la navigazione (pagine sempre aggiornate quando
// si è online, ma disponibili offline se già visitate), cache-first per gli
// asset statici (JS/CSS/font/immagini). Nessuna dipendenza esterna.

const CACHE = 'unimib-appunti-v1';
const BASE = '/unimib-magistrale/';

self.addEventListener('install', (event) => {
  // Attiva subito la nuova versione del service worker.
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  // Gestisci solo le richieste dello stesso dominio, dentro allo scope del sito.
  if (url.origin !== self.location.origin || !url.pathname.startsWith(BASE)) return;

  // Navigazione tra pagine: network-first, con fallback alla cache (e alla home).
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match(BASE)))
    );
    return;
  }

  // Asset statici: cache-first, poi rete (e aggiorna la cache).
  event.respondWith(
    caches.match(req).then((cached) => {
      const fromNet = fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => cached);
      return cached || fromNet;
    })
  );
});
