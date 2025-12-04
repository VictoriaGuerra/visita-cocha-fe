# Visita Cochabamba - Frontend (Angular/Ionic)

**Aplicación turística multiplataforma para la Alcaldía de Cochabamba**

Plataforma web e híbrida que permite a los ciudadanos y turistas descubrir atracciones, restaurantes, eventos y experiencias en Cochabamba de forma interactiva e inmersiva.

## 🎯 Descripción General

Visita Cochabamba es una aplicación desarrollada con **Angular 14** e **Ionic 6** que proporciona una experiencia moderna para explorar la ciudad. La plataforma integra datos dinámicos desde una base de datos MongoDB mediante una API REST, con soporte para múltiples idiomas y datos meteorológicos en tiempo real.

## ✨ Características Principales

### Experiencia de Usuario
- **Interfaz moderna y responsiva**: Diseño profesional optimizado para escritorio, tablet y móvil
- **Traducción automática**: Integración de Google Translate en 6 idiomas (Español, Inglés, Italiano, Quechua, Francés, Portugués)
- **Clima en tiempo real**: Datos meteorológicos actualizados de Open-Meteo API
- **Compartir experiencias**: Botón nativo para compartir contenido en redes sociales
- **Hero section con video**: Sección principal con fondo de video de YouTube que captura la esencia de Cochabamba

### Contenido Turístico
- **Atractivos turísticos**: Categorías (Monumentos, Museos, Parques, etc.) con descripciones detalladas
- **Restaurantes**: Filtrados por categoría gastronómica con información de precios y especialidades
- **Eventos**: Calendario interactivo de próximos eventos con fechas, horarios y detalles
- **Guías por categoría**: Exploración intuitiva mediante tarjetas interactivas

### Arquitectura Técnica
- **Patrón Repository híbrido**: Soporte simultáneo para Firebase y MongoDB
- **Cambio automático de base de datos**: Configuración dinámica según `environment.apiBaseUrl`
- **Servicio de ubicación**: Integración con mapas y cálculo de rutas
- **Arquitectura modular**: Componentes reutilizables y servicios especializados

## 🏗️ Mejoras Implementadas

### 1. **Migración a MongoDB** (En progreso)
- Implementación de servicio REST API (backend separado)
- Patrón repository inteligente que detecta automáticamente Firebase o MongoDB
- Endpoints preparados para operaciones CRUD, filtrados y paginación

### 2. **Diseño Visual Profesional**
- **Categorías de exploración**: Cards con overlay sutil, sin colores estridentes
- **Lista de eventos**: Diseño editorial con glassmorphism, fecha destacada en gradiente corporativo
- **Hero section**: Sección épica con video de YouTube autoplay, overlay morado profesional
- **Scroll indicator**: Botón flotante animado para navegar a secciones

### 3. **Traducción e Internacionalización**
- Widget oficial de Google Translate con soporte a 6 idiomas
- Styling personalizado para integración visual
- Botón compartir con Google Share API

### 4. **Servicios de Datos**
- **Weather Service**: Integración con Open-Meteo para datos meteorológicos sin API key
- **Category Service**: Gestión de categorías principales y categorías por tipo
- **Item Service**: Manejo de atraccivos, restaurantes y eventos

### 5. **Rutas Optimizadas**
- Enrutamiento modular por módulo (Home, Map, Event, Location, etc.)
- Lazy loading de módulos para mejor rendimiento
- Guardias de ruta para control de acceso

## 📁 Estructura de Archivos Modificados

```
src/
├── app/
│   ├── modules/
│   │   ├── home/                    # Módulo principal
│   │   │   ├── pages/home/          # Página de inicio
│   │   │   └── router/              # Rutas del módulo
│   │   │
│   │   ├── shared/
│   │   │   └── components/
│   │   │       ├── main-hero/       # Hero section con video
│   │   │       │   ├── .ts/.html/.scss
│   │   │       ├── category-list/   # Listado de categorías
│   │   │       │   └── .scss/.html/.ts
│   │   │       ├── event-list/      # Listado de eventos
│   │   │       │   └── .scss/.html/.ts
│   │   │       ├── google-translate/# Widget de traducción
│   │   │       ├── share-experience/# Botón compartir
│   │   │       └── main-toolbar/    # Barra de herramientas
│   │   │
│   │   └── [otros módulos]/
│   │
│   ├── services/
│   │   ├── weather.service.ts       # Datos climáticos
│   │   └── [otros servicios]
│   │
│   └── app-routing.module.ts        # Rutas principales
│
└── framework/
    └── repository/
        ├── firebase.repository-service.ts  # Híbrido Firebase/MongoDB
        ├── mongo.repository-service.ts     # Específico MongoDB
        └── api/
            └── config-list.model.ts        # Modelo de queries
```

## 🔄 Arquitectura de Datos: Firebase vs MongoDB

### Cuando Usar Firebase
**Condición**: `apiBaseUrl` está vacío o no configurado en `environment.ts`

```typescript
// environment.ts (desarrollo sin backend)
apiBaseUrl: ''  // ← Vacío = Usa Firebase
```

**Comportamiento**:
- Conecta directamente a Firestore (Angular Fire)
- Ideal para desarrollo inicial sin backend

### Cuando Usar MongoDB
**Condición**: `apiBaseUrl` tiene una URL válida

```typescript
// environment.ts (desarrollo con backend)
apiBaseUrl: 'http://localhost:3000'

// environment.prod.ts (producción)
apiBaseUrl: 'https://api.visitacocha.gob.bo'
```

**Comportamiento**:
- Conecta mediante API REST al backend Node.js
- Backend se conecta a MongoDB
- Recomendado para producción

### Servicios Híbridos (Funcionan en ambos)

Todos los servicios heredan de `FirebaseRepositoryService`:

```typescript
// Ejemplo: CategoryRepositoryService
export class CategoryRepositoryService extends FirebaseRepositoryService<MainCategory> {
  // Funciona con Firebase o MongoDB automáticamente
  
  getCategories(): Observable<MainCategory[]> {
    return this.list();  // Detecta y usa la fuente correcta
  }
  
  getCategoryById(id: string): Observable<MainCategory> {
    return this.getById(id);  // Híbrido
  }
  
  getByQuery(config: ConfigList): Observable<MainCategory[]> {
    return this.getByQuery(config);  // Soporta filtros en ambos
  }
}
```

## 🚀 Cómo Ejecutar

### Requisitos
- Node.js 16+ y npm 8+
- Angular CLI 14
- Backend visita-cocha-be (para MongoDB)

### Instalación Inicial

```bash
# 1. Clonar repositorio
git clone https://github.com/VictoriaGuerra/visita-cocha-fe.git
cd visita-cocha-fe

# 2. Instalar dependencias
npm install

# 3. Configurar entorno
# Si usas Firebase: dejar apiBaseUrl vacío
# Si usas MongoDB: ejecutar backend en puerto 3000 y configurar apiBaseUrl
```

### Desarrollo

```bash
# Terminal 1: Frontend
npm start
# Abrirá en http://localhost:4200

# Terminal 2: Backend (si usas MongoDB)
# En directorio visita-cocha-be
npm run start:dev
# Ejecutándose en http://localhost:3000
```

### Producción

```bash
# Build optimizado
npm run build

# Deploy en Firebase Hosting (si usas Firebase)
firebase deploy

# O deploy en servidor personalizado
# El archivo dist/ contiene la aplicación lista para producción
```

## ⚙️ Configuración

### Cambiar Base de Datos

**De Firebase a MongoDB**:

```typescript
// environment.ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:3000',  // ← Cambiar a URL del backend
  // ... resto de config
};
```

**Volver a Firebase**:

```typescript
// environment.ts
export const environment = {
  production: false,
  apiBaseUrl: '',  // ← Dejar vacío
  // ... resto de config
};
```

### Configurar Lenguaje por Defecto

```typescript
// En main.ts o app.component.ts
import { LOCALE_ID } from '@angular/core';

providers: [
  { provide: LOCALE_ID, useValue: 'es' }  // Español por defecto
]
```

## 📊 Dependencias Principales

| Dependencia | Versión | Propósito |
|------------|---------|----------|
| Angular | 14.2.9 | Framework principal |
| Ionic | 6.3.4 | Framework móvil |
| Firebase | 9.x | Base de datos (opcional) |
| PrimeNG | 14.x | Componentes UI |
| Tailwind CSS | 3.x | Estilos responsivos |
| RxJS | 7.x | Programación reactiva |

## 🌍 APIs Externas

### Google Translate Widget
- **URL**: Cargado dinámicamente
- **Idiomas**: 6 idiomas (ES, EN, IT, QU, FR, PT)
- **Configuración**: `google-translate.component.ts`

### Open-Meteo Weather API
- **URL**: `https://api.open-meteo.com/v1/forecast`
- **Ventaja**: Sin API key requerida
- **Datos**: Temperatura, condiciones climáticas actuales

### YouTube API
- **Uso**: Videos en hero section
- **Configuración**: Iframe con autoplay, mute y loop
- **Video**: Primeros 40 segundos de video ID `XjyawCcHhQc`

## 🔒 Seguridad

### Variables de Entorno Sensibles

```typescript
// environment.ts - NUNCA hacer commit con datos reales
firebaseConfig: {
  apiKey: 'xxx',      // Restringir clave en Firebase Console
  authDomain: 'xxx',
  projectId: 'xxx',
  // ... más configuración
}

// .env (si usas variables)
# Agregado a .gitignore
FIREBASE_API_KEY=xxx
MONGO_URI=xxx
```

### Configuración de CORS (Backend)

```typescript
// En backend (visita-cocha-be)
app.use(cors({
  origin: ['http://localhost:4200', 'https://visitacocha.gob.bo'],
  credentials: true
}));
```

## 📱 Responsive Design

- **Desktop** (1920px+): Layout completo, 4 items por fila
- **Tablet** (768px-1920px): Layout adaptado, 2-3 items
- **Mobile** (320px-768px): Stack vertical, 1 item

Todas las secciones usan `@media` queries y clases Tailwind responsivas.

## 🐛 Troubleshooting

### Error: "Cannot read property 'getCollectionName'"
**Causa**: Servicio no extiende correctamente `FirebaseRepositoryService`

```typescript
// ❌ Incorrecto
export class MyService {}

// ✅ Correcto
export class MyService extends FirebaseRepositoryService<MyEntity> {
  getCollectionName(): string { return 'my_collection'; }
}
```

### Error: "MongoDB connection refused"
**Causa**: Backend no está corriendo

```bash
# Verificar backend en puerto 3000
curl http://localhost:3000/health

# Si no funciona, iniciar backend
cd ../visita-cocha-be
npm run start:dev
```

### UI lenta después de cambiar a MongoDB
**Causa**: Queries complejas sin optimizar

```typescript
// Limitar resultados
this.service.getByQuery(config, 10);  // Límite 10 resultados

// O paginación
getPage(page: number, limit: number) {
  // Implementar en backend
}
```

## 📝 Logs y Debugging

### Modo Debug en Desarrollo

```typescript
// En app.component.ts
if (!environment.production) {
  enableDebugTools(componentRef);
}
```

### Ver Requests a Backend

```typescript
// En browser DevTools
// Network tab → filter by XHR
// Ver requests a http://localhost:3000
```

## 🤝 Contribuir

1. Crear rama: `git checkout -b feature/nueva-funcionalidad`
2. Commit: `git commit -am 'Add nueva funcionalidad'`
3. Push: `git push origin feature/nueva-funcionalidad`
4. Pull Request

## 📄 Licencia

Proyecto para Alcaldía de Cochabamba - Todos los derechos reservados

## 📞 Soporte

Para soporte técnico o consultas:
- **Email**: desarrolladores@alcaldia.gob.bo
- **Issues**: https://github.com/VictoriaGuerra/visita-cocha-fe/issues

---

**Última actualización**: Diciembre 2025  
**Rama principal**: `main`  
**Rama de desarrollo**: `feature_Rutas`
