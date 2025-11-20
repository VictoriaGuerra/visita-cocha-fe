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
   
    this.initializeGoogleTranslate();
  }

  ngAfterViewInit(): void {
 
    this.loadGoogleTranslateScript();
    
    this.hideBannerFrame();
  }

  private initializeGoogleTranslate(): void {
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'es', 
          includedLanguages: 'es,en,it,qu,fr,pt', 
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false
        },
        'google_translate_element'
      );
    };
  }


  private loadGoogleTranslateScript(): void {
    
    const existingScript = this.document.getElementById('google-translate-script');
    
    if (existingScript) {
      if (window.google && window.google.translate) {
        window.googleTranslateElementInit();
      }
      return;
    }

 
    const script = this.renderer2.createElement('script');
    script.id = 'google-translate-script';
    script.type = 'text/javascript';
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    script.defer = true;

    this.renderer2.appendChild(this.document.body, script);
  }

 
  private hideBannerFrame(): void {
    const observer = setInterval(() => {
      const banner = this.document.querySelector('.goog-te-banner-frame') as HTMLElement;
      if (banner) {
        banner.style.display = 'none';
      }
      
    
      if (this.document.body) {
        this.document.body.style.top = '0';
        this.document.body.style.position = 'static';
      }
      
      
      const widget = this.document.querySelector('#google_translate_element .goog-te-combo');
      if (widget) {
        clearInterval(observer);
      }
    }, 100);
   
    setTimeout(() => clearInterval(observer), 5000);
  }
}
