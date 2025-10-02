import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'list-title',
  templateUrl: './list-title.html'
})
export class ListTitleComponent implements OnInit {

  @Input()
  public title: string;

  @Input()
  public description: string;

  @Input()
  public icon: string;

  @Input()
  public css: string;

  @Input()
  public cssText: string;

  @Input()
  public route: string;

  @Input()
  public padding: boolean;

  @Input()
  public showLine: boolean = false;

  constructor() { }

  ngOnInit() {}

}
