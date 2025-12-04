# Manual Técnico - Frontend Visita Cochabamba

**Alcaldía de Cochabamba - Sistema de Información Turística**

Documentación técnica para desarrolladores que trabajen con la aplicación frontend. Este documento cubre arquitectura, componentes, servicios y patrones de desarrollo utilizados en Visita Cochabamba.

## Tabla de Contenidos

1. [Introducción](#introducción)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Arquitectura](#arquitectura)
4. [Módulos](#módulos)
5. [Servicios](#servicios)
6. [Componentes](#componentes)
7. [Patrones de Desarrollo](#patrones-de-desarrollo)
8. [Integración de APIs](#integración-de-apis)
9. [Rutas](#rutas)
10. [Estilos](#estilos)

## Introducción

Visita Cochabamba es una plataforma web e híbrida desarrollada con **Angular 14** e **Ionic 6** que permite la exploración interactiva de atractivos turísticos, restaurantes y eventos en Cochabamba.

El sistema fue diseñado con enfoque en mantenibilidad, escalabilidad y flexibilidad para soportar múltiples bases de datos (Firebase y MongoDB) mediante un patrón repository inteligente.

## Stack Tecnológico

### Lenguajes y Frameworks
- **TypeScript 4.7**: Tipado fuerte en todo el proyecto
- **Angular 14.2.9**: Framework web principal
- **Ionic 6.3.4**: Componentes móviles y UI
- **RxJS 7.x**: Programación reactiva

### Librerías UI y Utilitarios
- **PrimeNG 14.x**: Componentes avanzados (carousels, modales, etc.)
- **Tailwind CSS 3.x**: Estilos responsivos utilitarios
- **@angular/cdk**: Material Design Components Kit

### Bases de Datos y APIs
- **Firebase Firestore**: Base de datos NoSQL (opcional)
- **MongoDB Atlas**: Base de datos NoSQL (producción)
- **Express.js**: API REST backend (visita-cocha-be)
- **Open-Meteo API**: Datos climáticos sin autenticación
- **Google Translate API**: Traducción dinámica

### Testing y Desarrollo
- **Jasmine**: Framework de testing
- **Karma**: Test runner
- **Angular CLI**: Herramienta de desarrollo

## Arquitectura

### Diagrama de Capas

```
┌─────────────────────────────────────┐
│      Componentes (Presentación)     │
│  - Pages    - Shared Components     │
│  - Modules  - Layout Components     │
└────────────────┬────────────────────┘
                 │
┌─────────────────▼────────────────────┐
│    Servicios (Lógica de Negocio)    │
│  - Repository Services              │
│  - Domain Services (Weather, etc.)   │
│  - State Management (Signals/Rx)     │
└────────────────┬────────────────────┘
                 │
┌─────────────────▼────────────────────┐
│   Modelos e Interfaces              │
│  - Entidades (MainCategory, etc.)    │
│  - DTOs (Data Transfer Objects)      │
│  - Configuración                     │
└────────────────┬────────────────────┘
                 │
┌─────────────────▼────────────────────┐
│   Framework/Repository               │
│  - FirebaseRepositoryService         │
│  - MongoRepositoryService            │
│  - HttpClient Integration            │
└────────────────┬────────────────────┘
                 │
┌─────────────────▼────────────────────┐
│    APIs Externas                    │
│  - Firebase                         │
│  - MongoDB REST API                 │
│  - Google Translate                 │
│  - Open-Meteo Weather               │
└─────────────────────────────────────┘
```

### Patrón Repository Híbrido

El sistema implementa un patrón repository que detecta automáticamente qué fuente de datos usar:

```typescript
// FirebaseRepositoryService detecta automáticamente:
if (this._http && this._apiBaseUrl) {
  // Usa MongoDB REST API
  return this._http.get(`${this._apiBaseUrl}/${collection}`);
} else if (this._collectionRef) {
  // Usa Firebase Firestore
  return this._collectionRef.valueChanges();
}
```

**Ventajas**:
- Sin cambios de código para cambiar de base de datos
- Migración gradual de Firebase a MongoDB
- Desarrollo con Firebase, producción con MongoDB

## Módulos

### Módulo Compartido (shared/)

**Responsabilidad**: Componentes, pipes, directivas y servicios reutilizables

```
shared/
├── components/
│   ├── main-hero/                 # Hero section con video
│   ├── category-list/             # Listado de categorías
│   ├── event-list/                # Carrusel de eventos
│   ├── google-translate/          # Widget de traducción
│   ├── share-experience/          # Botón nativo de compartir
│   ├── main-toolbar/              # Barra de navegación
│   └── footer/                    # Pie de página
├── services/
│   ├── main-category.repository-service.ts
│   ├── weather.service.ts
│   └── [otros servicios]
├── pipes/
│   └── [pipes personalizados]
├── constants/
│   ├── api.constant.ts            # URLs de APIs
│   └── app.constant.ts            # Constantes generales
└── shared.module.ts               # Declaraciones compartidas
```

**Componentes Principales**:

#### 1. main-hero-page
- **Archivo**: `main-hero-page.component.ts/html/scss`
- **Propósito**: Sección épica de bienvenida
- **Features**:
  - Video de YouTube con autoplay, mute y loop
  - Fallback a imagen en móviles
  - Stats (altitud, temperatura, atractivosy)
  - Scroll indicator animado
  - Botones CTA (Call To Action)

```typescript
// main-hero-page.component.ts
export class MainHeroPageComponent implements OnInit {
  videoUrl: SafeResourceUrl;
  
  constructor(private sanitizer: DomSanitizer, private router: Router) {}
  
  ngOnInit() {
    const youtubeUrl = 'https://www.youtube.com/embed/XjyawCcHhQc?start=0&end=40&autoplay=1&mute=1&loop=1&controls=0';
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(youtubeUrl);
  }
}
```

#### 2. category-list
- **Archivo**: `category-list.component.ts/html/scss`
- **Propósito**: Cards interactivas de categorías
- **Features**:
  - Scroll horizontal
  - Overlay con gradiente
  - Transiciones suaves
  - Icono y nombre de categoría

#### 3. event-list
- **Archivo**: `event-list.component.ts/html/scss`
- **Propósito**: Carrusel de eventos próximos
- **Features**:
  - Carrusel automático (5s)
  - Indicadores paginación
  - Fecha destacada con gradiente
  - Información de ubicación y hora

#### 4. google-translate
- **Responsabilidad**: Carga widget de Google Translate
- **Configuración**: 6 idiomas (ES, EN, IT, QU, FR, PT)

```typescript
// google-translate.component.ts
export class GoogleTranslateComponent implements OnInit {
  ngOnInit() {
    this.loadGoogleTranslate();
  }
  
  private loadGoogleTranslate() {
    const script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.head.appendChild(script);
  }
}
```

#### 5. share-experience
- **Responsabilidad**: Compartir en redes sociales
- **API**: Navigator Share API (nativa del navegador)

### Módulo Home

```
home/
├── pages/
│   └── home/
│       ├── home.component.ts
│       ├── home.component.html
│       └── home.component.scss
├── router/
│   └── home-routing.module.ts
└── home.module.ts
```

**home.component.ts**:

```typescript
export class HomeComponent implements OnInit, OnDestroy {
  weatherData: Weather;
  queryList: any[] = [];
  publicMode: boolean = false;
  
  constructor(
    private weatherService: WeatherService,
    private categoryService: CategoryRepositoryService
  ) {}
  
  ngOnInit() {
    this.loadWeatherData();
    this.loadCategories();
  }
  
  loadWeatherData() {
    this.weatherService.getWeather()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => this.weatherData = data);
  }
  
  loadCategories() {
    this.categoryService.list()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => this.queryList = data);
  }
}
```

### Módulo Map

Gestiona visualización de mapas y ubicaciones geográficas.

```
map/
├── components/
│   └── map-canvas/
├── services/
│   └── map.service.ts
└── map.module.ts
```

### Módulo Event

Maneja eventos y anuncios especiales.

```
event/
├── pages/
│   └── event-detail/
├── components/
│   └── event-card/
└── event.module.ts
```

## Servicios

### 1. FirebaseRepositoryService (Híbrido)

**Ubicación**: `src/framework/repository/firebase.repository-service.ts`

**Métodos**:

```typescript
// CRUD Básico
create(entity: ENTITY): Observable<void>
delete(id: string): Observable<void>
getById(id: string): Observable<ENTITY>
list(): Observable<ENTITY[]>
update(entity: Partial<ENTITY>, id: string): Observable<void>

// Queries Avanzadas
getByQuery(configList: ConfigList, limit?: number): Observable<any>
getByAttribute(attribute: string, value: any): Observable<any>

// Operaciones en Lote
createMany(entityList: ENTITY[]): Promise<void>
createWithID(id: string, entity: ENTITY): Promise<void>
```

**Configuración de Queries**:

```typescript
// ConfigList - Estructura para queries
interface ConfigList {
  queryList?: Array<{
    field: string;
    operation: '==' | '<' | '>' | '<=' | '>=' | 'array-contains';
    value: any;
  }>;
  orderByConfigList?: Array<{
    field: string;
    direction: 'asc' | 'desc';
  }>;
}

// Ejemplo de uso:
const config: ConfigList = {
  queryList: [
    { field: 'available', operation: '==', value: true },
    { field: 'date', operation: '>=', value: new Date() }
  ],
  orderByConfigList: [
    { field: 'date', direction: 'asc' }
  ]
};

this.eventService.getByQuery(config, 10).subscribe(events => {
  console.log('Próximos 10 eventos:', events);
});
```

### 2. WeatherService

**Ubicación**: `src/app/services/weather.service.ts`

**API**: Open-Meteo (sin autenticación)

```typescript
export class WeatherService {
  private apiUrl = 'https://api.open-meteo.com/v1/forecast';
  private cochaCoordinates = {
    latitude: -17.39243457,
    longitude: -66.15810075
  };
  
  getWeather(): Observable<Weather> {
    const params = new HttpParams()
      .set('latitude', String(this.cochaCoordinates.latitude))
      .set('longitude', String(this.cochaCoordinates.longitude))
      .set('current', 'temperature_2m,weather_code')
      .set('timezone', 'America/La_Paz');
    
    return this.http.get<Weather>(this.apiUrl, { params });
  }
}

// Interfaz Weather
interface Weather {
  current: {
    temperature_2m: number;
    weather_code: number;
    time: string;
  };
}
```

### 3. CategoryRepositoryService

**Ubicación**: `src/app/modules/shared/services/main-category.repository-service.ts`

```typescript
@Injectable({ providedIn: 'root' })
export class CategoryRepositoryService extends FirebaseRepositoryService<MainCategory> {
  constructor(injector: Injector) {
    super(injector);
  }
  
  getCollectionName(): string {
    return 'main-categories';  // Colección en Firebase/MongoDB
  }
}
```

### 4. AnnouncementRepositoryService

**Responsabilidad**: Gestionar eventos y anuncios

```typescript
@Injectable({ providedIn: 'root' })
export class AnnouncementRepositoryService extends FirebaseRepositoryService<Announcement> {
  constructor(injector: Injector) {
    super(injector);
  }
  
  getCollectionName(): string {
    return 'announcements';
  }
}
```

## Componentes

### Componente Página (Page Component)

**Estructura típica**:

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  // Sujeto para unsubscribe automático
  private destroy$ = new Subject<void>();
  
  // Estados
  isLoading = true;
  items: any[] = [];
  
  constructor(private service: MyService) {}
  
  ngOnInit() {
    this.loadData();
  }
  
  loadData() {
    this.service.getItems()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data) => this.items = data,
        (error) => console.error('Error:', error),
        () => this.isLoading = false
      );
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### Componente Presentacional

```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-category-card',
  templateUrl: './category-card.component.html',
  styleUrls: ['./category-card.component.scss']
})
export class CategoryCardComponent {
  @Input() category: MainCategory;
  @Output() selected = new EventEmitter<MainCategory>();
  
  onSelect() {
    this.selected.emit(this.category);
  }
}
```

## Patrones de Desarrollo

### 1. Patrón OnPush Change Detection

Para mejor rendimiento, usar `ChangeDetectionStrategy.OnPush`:

```typescript
@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.html',
  styleUrls: ['./category-list.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryListComponent implements OnInit {
  constructor(private cdr: ChangeDetectorRef) {}
  
  // Usar cdr.markForCheck() si es necesario
}
```

### 2. Patrón RxJS con Pipes

```typescript
// Composición de operadores
this.service.getItems()
  .pipe(
    filter(items => items.length > 0),
    map(items => items.sort((a, b) => a.name.localeCompare(b.name))),
    debounceTime(300),
    takeUntil(this.destroy$)
  )
  .subscribe(sortedItems => this.items = sortedItems);
```

### 3. Unsubscribe Automático

```typescript
// ✅ Forma correcta - Usar takeUntil
private destroy$ = new Subject<void>();

subscription$ = this.service.getData()
  .pipe(takeUntil(this.destroy$));

ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}
```

## Integración de APIs

### Google Translate

**Configuración en component**:

```typescript
// google-translate.component.ts
declare var google: any;

export class GoogleTranslateComponent implements OnInit {
  ngOnInit() {
    this.loadTranslateWidget();
  }
  
  private loadTranslateWidget() {
    const script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.head.appendChild(script);
    
    window['googleTranslateElementInit'] = () => {
      new google.translate.TranslateElement({
        pageLanguage: 'es',
        includedLanguages: 'es,en,it,qu,fr,pt'
      }, 'google-translate-element');
    };
  }
}
```

**HTML**:

```html
<div id="google-translate-element"></div>
<div class="skiptranslate" id="google_translate_element"></div>
```

### Open-Meteo Weather API

**Ejemplo de integración**:

```typescript
// weather.service.ts
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private apiUrl = 'https://api.open-meteo.com/v1/forecast';
  
  constructor(private http: HttpClient) {}
  
  getCurrentWeather(lat: number, lon: number): Observable<any> {
    const params = new HttpParams()
      .set('latitude', lat.toString())
      .set('longitude', lon.toString())
      .set('current', 'temperature_2m,weather_code,wind_speed_10m')
      .set('timezone', 'America/La_Paz');
    
    return this.http.get<any>(this.apiUrl, { params })
      .pipe(
        map(response => ({
          temperature: response.current.temperature_2m,
          weatherCode: response.current.weather_code,
          windSpeed: response.current.wind_speed_10m
        })),
        catchError(error => {
          console.error('Error fetching weather:', error);
          return of(null);
        })
      );
  }
}
```

### YouTube Embed

```html
<!-- Hero section con video YouTube -->
<iframe 
  [src]="videoUrl | safeResourceUrl" 
  width="100%" 
  height="100%"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen>
</iframe>
```

```typescript
// Componente
private sanitizer: DomSanitizer;

getYoutubeUrl(): SafeResourceUrl {
  const url = 'https://www.youtube.com/embed/XjyawCcHhQc?start=0&end=40&autoplay=1&mute=1&loop=1&controls=0';
  return this.sanitizer.bypassSecurityTrustResourceUrl(url);
}
```

## Rutas

### Estructura de Rutas Modular

```typescript
// app-routing.module.ts
const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'map',
    loadChildren: () => import('./modules/map/map.module').then(m => m.MapModule)
  },
  {
    path: 'events',
    loadChildren: () => import('./modules/event/event.module').then(m => m.EventModule)
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
```

### Lazy Loading

Las rutas secundarias usan **lazy loading** para optimizar rendimiento:

```typescript
// home.module.ts
const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'search',
        component: SearchComponent
      }
    ]
  }
];
```

## Estilos

### Arquitectura SCSS

```
src/assets/scss/
├── styles.scss          # Archivo principal
├── base/
│   ├── _reset.scss
│   ├── _typography.scss
│   └── _variables.scss
├── components/
│   ├── _buttons.scss
│   ├── _cards.scss
│   └── _forms.scss
├── themes/
│   └── _colors.scss
├── utilities/
│   ├── _spacing.scss
│   ├── _sizing.scss
│   └── _positioning.scss
└── vendors/
    └── _tailwind.scss
```

### Variables de Color

```scss
// _variables.scss
$color-primary: #482778;      // Púrpura
$color-secondary: #af1957;    // Rosa
$color-tertiary: #00add8;     // Cian
$color-light: #f5f5f5;
$color-dark: #1a1a1a;

// Gradientes
$gradient-primary: linear-gradient(135deg, $color-primary 0%, $color-secondary 100%);
$gradient-soft: linear-gradient(135deg, rgba(72, 39, 120, 0.5) 0%, rgba(175, 25, 87, 0.5) 100%);
```

### Responsive Breakpoints

```scss
$breakpoints: (
  'small': 320px,    // Móvil
  'medium': 768px,   // Tablet
  'large': 1024px,   // Desktop
  'xlarge': 1440px   // Desktop Grande
);

@mixin respond-to($breakpoint) {
  @media (min-width: map-get($breakpoints, $breakpoint)) {
    @content;
  }
}

// Uso:
.hero {
  font-size: 24px;
  
  @include respond-to('large') {
    font-size: 48px;
  }
}
```

### Componentes de Estilo Reutilizables

```scss
// _buttons.scss
.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &--primary {
    background: $color-primary;
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(72, 39, 120, 0.3);
    }
  }
  
  &--secondary {
    background: transparent;
    color: $color-primary;
    border: 2px solid $color-primary;
    
    &:hover {
      background: $color-primary;
      color: white;
    }
  }
}
```

## Testing

### Unit Testing con Jasmine

```typescript
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [MockService]
    }).compileComponents();
    
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should load data on init', () => {
    spyOn(component, 'loadData');
    component.ngOnInit();
    expect(component.loadData).toHaveBeenCalled();
  });
});
```

### Ejecutar Tests

```bash
# Todos los tests
ng test

# Tests específicos
ng test --include='**/home.component.spec.ts'

# Con cobertura
ng test --code-coverage
```

## Performance

### Optimizaciones Implementadas

1. **OnPush Change Detection**: Reducir detección de cambios innecesarios
2. **Lazy Loading Modules**: Cargar módulos bajo demanda
3. **Tree Shaking**: Remover código no utilizado
4. **Image Optimization**: Optimizar imágenes con CDN
5. **Caching**: Cachear datos con HttpClient

### Monitoreo

```bash
# Build de producción
ng build --prod

# Analizar bundle
npm install -g webpack-bundle-analyzer
webpack-bundle-analyzer dist/*/stats.json
```

## Deployment

### Build para Producción

```bash
# Build optimizado
ng build --configuration production

# Resultado en dist/
```

### Deploy en Firebase Hosting

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Inicializar Firebase
firebase init

# Deploy
firebase deploy --only hosting
```

---

**Versión**: 1.0.0  
**Última actualización**: Diciembre 2025  
**Autor**: Equipo Desarrollo Alcaldía de Cochabamba  
**Estado**: Producción
