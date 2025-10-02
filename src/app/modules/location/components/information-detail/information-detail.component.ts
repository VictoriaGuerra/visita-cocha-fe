import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'information-detail',
  templateUrl: './information-detail.html'
})
export class InformationDetailComponent implements OnInit {

  @Input()
  public item: any;

  constructor() { }

  ngOnInit() {
  }

}
