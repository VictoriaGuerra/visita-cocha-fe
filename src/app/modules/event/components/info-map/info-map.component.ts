import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-info-map-event',
  templateUrl: './info-map.component.html'
})
export class InfoMapComponent implements OnInit {

  @Input()
  public data: any;

  constructor() { }

  ngOnInit() {
  }

}
