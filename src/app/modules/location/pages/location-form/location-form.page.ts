import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';

import {StateService} from 'src/app/modules/shared/services/state.service';

@Component({
  selector: 'location-form-page',
  templateUrl: './location-form.page.html'
})
export class LocationFormPage implements OnInit {

  public module: string;

  constructor(private _stateService: StateService,
              public router: Router) {
  }

  ngOnInit(): void {
    this._stateService.changeBackState(true);
  }
}
