import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.html'
})
export class FaqComponent implements OnInit {

  @Input()
  public faq: any;

  constructor() { }

  ngOnInit() {
  }

}
