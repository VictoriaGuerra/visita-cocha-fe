import { Component, OnInit, Input } from '@angular/core';
import { getBackgroundString } from '../../utils/imgBackground.util';

@Component({
  selector: 'location-card',
  templateUrl: './location-card.html'
})
export class AtracttionCardComponent implements OnInit {

  @Input()
  public location: any;

  @Input()
  public module: any;

  constructor() { }

  ngOnInit() {
  }

  getBackgroundString(url: string) {
    let imageLink: string = url;
    if (!url) {
      imageLink = 'https://firebasestorage.googleapis.com/v0/b/cocha-turismo.appspot.com/o/icons%2Fempty.svg?alt=media&token=2a1017de-4eff-41c1-8046-b02aec903a71';
    }

    return getBackgroundString(imageLink);
  }
}
