import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.component.html'
})
export class EmptyStateComponent implements OnInit {
  
  @Input()
  emptyObject: any;

  constructor() { }

  ngOnInit() {}

}
