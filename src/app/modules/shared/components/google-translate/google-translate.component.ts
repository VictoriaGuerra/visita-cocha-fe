import { Component, OnInit, AfterViewInit, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

@Component({
  selector: 'app-google-translate',
  templateUrl: './google-translate.component.html',
  styleUrls: ['./google-translate.component.scss']
})
export class GoogleTranslateComponent implements OnInit, AfterViewInit {

  constructor(
    private renderer2: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit(): void {
    // Inicializar la función global antes de cargar el script
    this.initializeGoogleTranslate();
  }

  ngAfterViewInit(): void {
    // Cargar el script de Google Translate después de que la vista esté lista
    this.loadGoogleTranslateScript();
  }

  /**
   * Inicializa la función global googleTranslateElementInit
   * que será llamada por el script de Google Translate
   */
  private initializeGoogleTranslate(): void {
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'es', // Idioma por defecto: español
          includedLanguages: 'es,en,it,qu,fr,pt', // Idiomas disponibles
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false
        },
        'google_translate_element'
      );
    };
  }

  /**
   * Carga dinámicamente el script de Google Translate
   */
  private loadGoogleTranslateScript(): void {
    // Verificar si el script ya está cargado
    const existingScript = this.document.getElementById('google-translate-script');
    
    if (existingScript) {
      // Si ya existe, solo inicializar
      if (window.google && window.google.translate) {
        window.googleTranslateElementInit();
      }
      return;
    }

    // Crear el elemento script
    const script = this.renderer2.createElement('script');
    script.id = 'google-translate-script';
    script.type = 'text/javascript';
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    script.defer = true;

    // Agregar el script al documento
    this.renderer2.appendChild(this.document.body, script);
  }
}
