// main.js - Script compartido en todas las páginas

console.log('main.js cargado correctamente');

// Registrar el Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/PWA-CalendarSelect/sw.js', { scope: '/PWA-CalendarSelect/' })
      .then(registration => {
        console.log('Service Worker registrado exitosamente:', registration.scope);
      })
      .catch(error => {
        console.error('Error al registrar el Service Worker:', error);
      });
  });
}

// Función para verificar el estado de la conexión
function updateOnlineStatus() {
  const status = navigator.onLine ? 'online' : 'offline';
  console.log(`Estado de conexión: ${status}`);
}

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

// Verificar estado inicial
updateOnlineStatus();
