/*
  Plantilla de Service Worker para notificaciones.
  - Para FCM (Firebase Cloud Messaging) copia aquí tu firebaseConfig y descomenta la inicialización.
  - También manejamos eventos 'push' genéricos como fallback.

  NOTA: Este archivo debe quedar en la raíz de `src/` para que al compilar se copie a la raíz del build
  (dist/www) y así el navegador lo encuentre como `/firebase-messaging-sw.js`.

  Ejemplo (descomentar e insertar tu config):
  importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js');
  importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js');

  // const firebaseConfig = {
  //   apiKey: "...",
  //   authDomain: "...",
  //   projectId: "...",
  //   storageBucket: "...",
  //   messagingSenderId: "...",
  //   appId: "...",
  //   measurementId: "..."
  // };

  // firebase.initializeApp(firebaseConfig);
  // const messaging = firebase.messaging();

  // messaging.onBackgroundMessage(function(payload) {
  //   const notificationTitle = payload.notification?.title || 'Notificación';
  //   const notificationOptions = {
  //     body: payload.notification?.body || '',
  //     icon: '/assets/icons/icon-192.png'
  //   };
  //   self.registration.showNotification(notificationTitle, notificationOptions);
  // });

*/

self.addEventListener('push', function(event) {
  try {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'Notificación';
    const options = {
      body: data.body || '',
      icon: data.icon || '/assets/icons/icon-192.png',
      data: data.url || '/' 
    };

    event.waitUntil(self.registration.showNotification(title, options));
  } catch (e) {
    // Not JSON payload, show raw
    const text = event.data ? event.data.text() : 'Tienes una nueva notificación';
    event.waitUntil(self.registration.showNotification('Notificación', { body: text }));
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const url = event.notification.data || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
