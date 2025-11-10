# Configuración de Push (FCM) y registro GAMC

Este documento explica, paso a paso, cómo configurar notificaciones push web usando Firebase Cloud Messaging (FCM) y cómo conectar el frontend con el endpoint GAMC que almacena tokens de dispositivo. Está pensado para desarrolladores que trabajen con este repositorio `visita-cocha-fe`.

Contenido:
- Resumen
- Requisitos
- Configurar Firebase (FCM)
- Añadir la configuración al proyecto
- Service Worker (ya hay plantilla)
- Contrato backend (GAMC)
- Probar localmente
- Comandos útiles (Windows PowerShell / CMD)
- Problemas comunes y soluciones

---

## Resumen

El flujo básico es:

1. Registrar un Service Worker accesible en la raíz del sitio: `/firebase-messaging-sw.js`.
2. En el cliente (navegador) pedir permiso al usuario y obtener un token FCM.
3. Enviar el token al backend GAMC para almacenarlo (POST `/devices`).
4. Enviar notificaciones desde backend (o Firebase Console) usando los tokens almacenados.

Este repo ya incluye:
- `src/firebase-messaging-sw.js`: plantilla de service worker (añade tu firebaseConfig aquí si usas FCM).
- `src/app/modules/shared/services/push-notification.service.ts`: métodos `registerServiceWorker()`, `requestPermission()` y `registerDevice(token, meta)`.
- Un botón en la toolbar que solicita permiso y registra el token (comportamiento mínimo de UI).

---

## Requisitos

- Cuenta de Firebase con Cloud Messaging habilitado.
- Credenciales del proyecto (firebaseConfig).
- Si usas un backend propio (GAMC): endpoint público para recibir tokens y enviar push.
- Navegador moderno (Chrome/Edge/Firefox) y HTTPS (o `localhost` durante desarrollo).

---

## Configurar Firebase (FCM)

1. Entra a https://console.firebase.google.com y crea un proyecto (o usa uno existente).
2. Ve a la configuración del proyecto (ícono de engranaje) → "Tus apps" → Añadir app web.
3. Copia el objeto `firebaseConfig` que te entrega Firebase; tiene propiedades apiKey, authDomain, projectId, ...
4. Habilita Cloud Messaging y obtén las credenciales necesarias (Server key / Firebase Admin) para tu backend.
5. (Opcional) Obtén la clave pública VAPID si tu flujo de obtención de token la requiere.

---

## Añadir la configuración al proyecto

1. Añade `firebaseConfig` a `src/environments/environment.ts` (y `environment.prod.ts`) si no está ya.

Ejemplo (simplificado):

```ts
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: 'XXX',
    authDomain: 'XXX.firebaseapp.com',
    projectId: 'XXX',
    storageBucket: 'XXX.appspot.com',
    messagingSenderId: '123456789',
    appId: '1:123:web:abcd',
  },
  gamcPushUrl: 'https://tubackend.example.com' // opcional, para registrar tokens
};
```

2. Verifica que `AppModule` importa `AngularFireModule.initializeApp(environment.firebaseConfig)` y `AngularFireMessagingModule` (en tu `src/app/app.module.ts` ya está configurado).

3. Añade tu `firebaseConfig` (opcional) al `src/firebase-messaging-sw.js` plantilla si quieres que el SW maneje mensajes de background vía FCM (ver sección SW).

---

## Service Worker (ya hay plantilla)

Archivo: `src/firebase-messaging-sw.js` (ya incluido en el repo). Recomendaciones:

- Si vas a usar FCM en el SW, descomenta las `importScripts(...)` y pega tu `firebaseConfig` en el bloque comentado. Ejemplo en el propio archivo.
- El archivo debe compilarse a la raíz del sitio (por eso debe estar en `src/`), de modo que el navegador lo encuentre como `/firebase-messaging-sw.js`.

Si usas Angular Service Worker u otro flujo, adapta según corresponda. Para FCM con `firebase-messaging-compat` el SW típicamente importa los scripts de Firebase y llama `messaging.onBackgroundMessage(...)`.

---

## Contrato backend (GAMC)

Este repo usa `PushNotificationService.registerDevice(token, meta)` que hace:

- POST `environment.gamcPushUrl + '/devices'` con body `{ token, meta }`.
- POST `environment.gamcPushUrl + '/send'` para enviar una notificación de prueba (método `sendTestNotification(payload)`).

Ejemplo de payload para `POST /devices`:

```json
{ "token": "abc123...", "meta": { "source": "web", "platform": "chrome" } }
```

Ejemplo de petición de prueba al endpoint de envío (servidor debe encargarse de usar FCM Admin o API):

```json
{
  "token": "abc123...",
  "notification": {
    "title": "Prueba desde GAMC",
    "body": "Hola desde la plataforma",
    "icon": "/assets/icons/icon-192.png",
    "click_action": "https://tusitio.example.com"
  }
}
```

Nota: el formato exacto lo define tu backend; ajusta `PushNotificationService` si tu endpoint espera otro shape.

---

## Probar localmente

1. Construir el proyecto:

```powershell
# desde PowerShell o CMD en Windows
npm run build
```

Si PowerShell bloquea `npm` por políticas de ejecución, usa `cmd.exe` o cambia la política (ver sección Troubleshooting).

2. Servir el contenido `www/` o `dist/` en un servidor estático (necesitas que el SW esté servido desde la raíz):

```powershell
# con npx http-server
npx http-server ./www -p 8080

# o con serve
npx serve -s www -l 8080
```

3. Abrir `http://localhost:8080` en Chrome y:

- Abrir DevTools → Application → Service Workers y revisar que `/firebase-messaging-sw.js` esté registrado.
- Pulsar el botón de notificaciones en la barra de la app (el UI que agregamos). Debería aparecer el prompt de permisos.
- Si AngularFire Messaging está configurado, el servicio intentará obtener un token y enviarlo al backend.

4. Verificar backend: comprueba que `POST /devices` recibió el token y que se almacenó correctamente.

5. Enviar notificación de prueba desde backend (o desde Firebase Console si pruebas directo): verifica que la notificación aparece incluso con la página en segundo plano.

---

## Comandos útiles (Windows)

- Ejecutar build desde CMD (evita restricciones de PowerShell si las tienes):

```cmd
cd C:\ruta\a\visita-cocha-fe
npm run build
```

- Cambiar temporalmente la política de PowerShell (si entiendes los riesgos):

```powershell
# Ejecutar como usuario actual
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force
npm run build
```

---

## Problemas comunes y soluciones

- "No se registra el service worker": Comprueba que el SW esté en la raíz (`/firebase-messaging-sw.js`) en el build y que sirvas desde `www/` o la raíz del sitio. Revisa la consola y Application → Service Workers.
- "No aparece el prompt de notificaciones": Asegúrate de que `Notification` es soportado y que ya no hayas denegado previamente los permisos. En Chrome: `Configuración → Privacidad y seguridad → Configuración del sitio → Notificaciones`.
- "No se puede obtener token FCM": Revisa que `AngularFireMessagingModule` esté configurado y que el SW tenga `firebase.messaging()` inicializado si usas la compat SW. A menudo falta la clave pública VAPID o el `firebaseConfig` en el SW.
- "npm no se ejecuta en PowerShell": ejecutar en `cmd.exe` o modificar la política de ejecución como se indica arriba.

---

## Notas de seguridad

- No pongas claves privadas (Server Key) en el frontend. Usa claves públicas (VAPID) en el cliente y guarda las server keys en el backend.
- Valida y filtra tokens en backend. Protege los endpoints `/devices` y `/send` con autenticación cuando sea necesario.

---

Si quieres, puedo:

- A) Insertar tu `firebaseConfig` directamente en `src/firebase-messaging-sw.js` (pégala aquí o indica que lo haga),
- B) Añadir una pequeña pantalla de depuración en la app que muestre `reg.scope` y el token obtenido, o
- C) Generar un `docs/push-api-contract.md` con ejemplos más precisos para tu backend GAMC.

Elige A, B o C (o pide otra cosa) y lo implemento.