# Componente Google Translate para Visita Cocha

## 📝 Descripción
Componente de Angular que integra el widget oficial de Google Translate para proporcionar traducción multiidioma en la aplicación Visita Cocha.

## 🌍 Idiomas Soportados
- **Español (es)** - Idioma por defecto
- **Inglés (en)**
- **Italiano (it)**
- **Quechua (qu)**
- **Francés (fr)**
- **Portugués (pt)**

## 📦 Archivos Creados

### 1. Componente Principal
- **Ubicación**: `src/app/modules/shared/components/google-translate/`
- **Archivos**:
  - `google-translate.component.ts` - Lógica del componente
  - `google-translate.component.html` - Template
  - `google-translate.component.scss` - Estilos (vacío por ahora)

### 2. Servicio de Traducción
- **Ubicación**: `src/app/modules/shared/services/translation.service.ts`
- **Funciones**:
  - `getSupportedLanguages()` - Lista de idiomas disponibles
  - `getCurrentLanguage()` - Detecta el idioma del navegador
  - `isLanguageSupported()` - Verifica soporte del idioma

## 🚀 Uso del Componente

### En cualquier página o componente:

```html
<!-- Simplemente agrega el selector -->
<app-google-translate></app-google-translate>
```

### Ejemplo en una página de Ionic:

```html
<ion-header>
  <ion-toolbar>
    <ion-title>Visita Cocha</ion-title>
    <!-- Agregar el traductor en el toolbar -->
    <ion-buttons slot="end">
      <app-google-translate></app-google-translate>
    </ion-buttons>
  </ion-toolbar>
</ion-header>

<ion-content>
  <h1>Bienvenido a Visita Cocha</h1>
  <p>Este contenido será traducido automáticamente.</p>
</ion-content>
```

## 🔧 Funcionamiento Técnico

### 1. Carga del Script
El componente carga dinámicamente el script de Google Translate:
```
//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit
```

### 2. Inicialización
Se crea una función global `googleTranslateElementInit` que inicializa el widget con:
- **pageLanguage**: `'es'` (español como idioma base)
- **includedLanguages**: `'es,en,it,qu,fr,pt'`
- **layout**: Diseño simple e inline
- **autoDisplay**: `false` (no muestra automáticamente)

### 3. Renderizado
El widget se renderiza dentro del div con id `google_translate_element`

## 📱 Integración Recomendada

### Opción 1: En el toolbar principal
```typescript
// src/app/modules/shared/components/main-toolbar/main-toolbar.component.html
<ion-toolbar>
  <ion-buttons slot="end">
    <app-google-translate></app-google-translate>
  </ion-buttons>
</ion-toolbar>
```

### Opción 2: En el app.component
```html
<!-- src/app/app.component.html -->
<ion-app>
  <ion-header>
    <ion-toolbar>
      <ion-title>Visita Cocha</ion-title>
      <ion-buttons slot="end">
        <app-google-translate></app-google-translate>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-router-outlet></ion-router-outlet>
</ion-app>
```

### Opción 3: Como componente flotante
```html
<ion-fab vertical="top" horizontal="end" slot="fixed">
  <app-google-translate></app-google-translate>
</ion-fab>
```

## ⚙️ Configuración Adicional

### Si necesitas cambiar los idiomas:
Edita el archivo `google-translate.component.ts` línea 33:
```typescript
includedLanguages: 'es,en,it,qu,fr,pt', // Agrega o quita idiomas aquí
```

### Si necesitas cambiar el idioma por defecto:
Edita el archivo `google-translate.component.ts` línea 32:
```typescript
pageLanguage: 'es', // Cambia 'es' por otro código de idioma
```

## 🎨 Personalización de Estilos (Próximamente)

El componente actualmente no tiene estilos personalizados. Para agregar estilos en el futuro, edita:
```scss
// src/app/modules/shared/components/google-translate/google-translate.component.scss
```

## 📋 Notas Importantes

1. **Conectividad a Internet**: El componente requiere conexión a internet para funcionar.

2. **Rendimiento**: Google Translate puede añadir tiempo de carga inicial. El script se carga de forma asíncrona para minimizar el impacto.

3. **SEO**: El contenido traducido por Google Translate no afecta el SEO original de tu sitio.

4. **Quechua**: El soporte para Quechua (qu) está disponible en Google Translate, pero la calidad de traducción puede variar.

## 🔄 Próximos Pasos

1. **Agregar el componente** a tu toolbar o página principal
2. **Probar** la traducción en diferentes páginas
3. **Personalizar estilos** según el diseño de Visita Cocha
4. **Configurar persistencia** del idioma seleccionado (localStorage)

## 🐛 Troubleshooting

### El widget no aparece
- Verifica la conexión a internet
- Revisa la consola del navegador por errores
- Asegúrate de que el componente esté declarado en `SharedModule`

### El widget aparece pero no traduce
- Verifica que los códigos de idioma sean correctos
- Revisa que el contenido de la página sea traducible (no todo el contenido HTML se traduce)

### Conflictos con Ionic
- Si hay problemas de renderizado, intenta agregar el componente en `ion-content` en lugar del `ion-header`

## 📞 Soporte

Para más información sobre la API de Google Translate:
https://cloud.google.com/translate/docs
