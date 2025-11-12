import { Injectable } from '@angular/core';

/**
 * Servicio para manejar la traducción de la aplicación
 * usando Google Translate Widget
 */
@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  // Idiomas soportados
  private readonly supportedLanguages = {
    es: 'Español',
    en: 'English',
    it: 'Italiano',
    qu: 'Quechua',
    fr: 'Français',
    pt: 'Português'
  };

  constructor() { }

  /**
   * Obtiene la lista de idiomas soportados
   */
  getSupportedLanguages(): { [key: string]: string } {
    return this.supportedLanguages;
  }

  /**
   * Obtiene el idioma actual del navegador
   */
  getCurrentLanguage(): string {
    return navigator.language.split('-')[0];
  }

  /**
   * Verifica si un idioma está soportado
   */
  isLanguageSupported(lang: string): boolean {
    return Object.keys(this.supportedLanguages).includes(lang);
  }
}
