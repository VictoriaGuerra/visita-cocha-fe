import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { getBackgroundGradientString } from 'src/app/modules/shared/utils/imgBackground.util';

@Component({
  selector: 'hero-list',
  templateUrl: './hero-list.html'
})
export class HeroListComponent implements OnInit {

  @Input()
  public module: any;

  public title: string;
  public placeholder: string;

  constructor() {
  }

  ngOnInit() {
    this._initBackground();
  }

  getBackgroundString(url: string) {
    return getBackgroundGradientString(url);
  }

  private _initBackground(): void {
    switch (this.module) {
      case 'attractions':
        this.title = 'Turismo';
        this.placeholder = 'Encuentra tu próximo destino';
        break;

      case 'restaurants':
        this.title = 'Gastronomía';
        this.placeholder = 'Experimenta nuevos sabores';
        break;
    }
  }
}
