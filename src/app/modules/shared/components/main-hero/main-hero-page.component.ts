import { Component, OnInit } from '@angular/core';
import { getBackgroundString } from '../../utils/imgBackground.util';

@Component({
  selector: 'main-hero-page',
  templateUrl: './main-hero-page.html'
})
export class MainHeroComponent implements OnInit {

  public background: any;

  constructor() {
    this.background = 'assets/images/backgrounds/mainCover.jpg';
  }

  ngOnInit() {
  }

  getBackgroundString(url: string) {
    return getBackgroundString(url);
  }
}
