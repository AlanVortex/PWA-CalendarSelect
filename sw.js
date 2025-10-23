// sw.js - Service Worker con estrategia Cache Only para App Shell y Dynamic Cache para librerías

const APP_SHELL_CACHE = 'app-shell-v1';
const DYNAMIC_CACHE = 'dynamic-cache-v1';

// Recursos del App Shell (Cache Only)
const APP_SHELL_RESOURCES = [
  '/',
  '/index.html',
  '/calendario.html',
  '/formulario.html',
  '/main.js',
  '/manifest.json',
  'https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4',
  // iOS Icons
  '/assets/192.png',
  '/assets/512.png'
];

// ============================================
// EVENTO: INSTALL
// ============================================
self.addEventListener('install', event => {
  console.log('[Service Worker] Instalando...');
  
  event.waitUntil(
    caches.open(APP_SHELL_CACHE)
      .then(cache => {
        console.log('[Service Worker] Cacheando App Shell');
        return cache.addAll(APP_SHELL_RESOURCES);
      })
      .then(() => {
        console.log('[Service Worker] App Shell cacheado correctamente');
        return self.skipWaiting(); // Activar inmediatamente
      })
  );
});

// ============================================
// EVENTO: ACTIVATE
// ============================================
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activando...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            // Eliminar cachés antiguas
            if (cacheName !== APP_SHELL_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('[Service Worker] Eliminando caché antigua:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[Service Worker] Activado correctamente');
        return self.clients.claim(); // Tomar control inmediato
      })
  );
});

// ============================================
// EVENTO: FETCH
// ============================================
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // ============================
  // ESTRATEGIA 1: Cache Only (App Shell)
  // ============================
  // Para las páginas HTML y main.js siempre desde caché
  if (
    url.pathname === '/' ||
    url.pathname === '/index.html' ||
    url.pathname === '/calendario.html' ||
    url.pathname === '/formulario.html' ||
    url.pathname === '/main.js' ||
    url.href.includes('@tailwindcss/browser')
  ) {
    event.respondWith(
      caches.match(request)
        .then(response => {
          if (response) {
            console.log(`[Cache Only] Devolviendo desde caché: ${request.url}`);
            return response;
          }
          // Si por alguna razón no está en caché, intentar red (fallback)
          console.warn(`[Cache Only] No encontrado en caché: ${request.url}`);
          return fetch(request);
        })
    );
    return;
  }
  
  // ============================
  // ESTRATEGIA 2: Cache First, Network Fallback (Dynamic Cache)
  // ============================
  // Para los recursos de las librerías (FullCalendar, Select2, jQuery)
  if (
    url.href.includes('fullcalendar') ||
    url.href.includes('select2') ||
    url.href.includes('jquery')
  ) {
    event.respondWith(
      // 1. INTENTAR: Buscar el recurso en TODAS las cachés
      caches.match(request)
        .then(response => {
          // 2. ÉXITO: Si se encuentra en caché, lo devolvemos inmediatamente
          if (response) {
            console.log(`[Dynamic Cache] Devolviendo desde caché: ${request.url}`);
            return response;
          }
          
          // 3. FALLA (Cache Miss): Si no está en caché, vamos a la red
          console.log(`[Dynamic Cache] No en caché, buscando en red: ${request.url}`);
          
          // Crear una nueva request con modo 'cors' para recursos externos
          const fetchRequest = new Request(request.url, {
            method: request.method,
            headers: request.headers,
            mode: 'cors',
            credentials: 'omit',
            cache: 'default'
          });
          
          return fetch(fetchRequest)
            .then(networkResponse => {
              // Verificar que la respuesta sea válida
              if (!networkResponse || networkResponse.status !== 200) {
                console.error(`[Dynamic Cache] Respuesta inválida para: ${request.url}`);
                return networkResponse;
              }
              
              // 4. ÉXITO DE RED: Clonamos la respuesta (porque solo se puede leer una vez)
              const responseToCache = networkResponse.clone();
              
              // 5. CACHEO: Abrimos la caché dinámica y guardamos la nueva respuesta
              caches.open(DYNAMIC_CACHE)
                .then(cache => {
                  console.log(`[Dynamic Cache] Guardando en caché: ${request.url}`);
                  cache.put(request, responseToCache);
                });
              
              // 6. DEVOLVER: Devolvemos la respuesta de la red al navegador
              return networkResponse;
            })
            .catch(error => {
              // 7. FALLA TOTAL: Tanto caché como red fallaron
              console.error(`[Dynamic Cache] Error total para ${request.url}:`, error);
              // Devolver desde caché si existe (aunque ya lo intentamos arriba)
              return caches.match(request);
            });
        })
    );
    return;
  }
  
  // ============================
  // ESTRATEGIA 3: Network First (para otros recursos)
  // ============================
  // Para cualquier otro recurso, NO interceptar y dejar que el navegador lo maneje
  // Esto evita problemas con CORS y otros recursos externos
});
