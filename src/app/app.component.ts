import { Component, OnInit } from '@angular/core';
import { SeoService } from './modules/shared/services/seo.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {

  constructor(private _seo: SeoService) {
  }

  ngOnInit(): void {
    // Set sensible SEO defaults for the SPA shell
    this._seo.setTitle('Visita Cochabamba');
    this._seo.setDescription('Guía turística de Cochabamba — lugares, gastronomía, eventos y rutas.');
  }
}
