import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Location } from '@angular/common';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-main-toolbar',
  templateUrl: './main-toolbar.component.html',
  styleUrls: ['./main-toolbar.component.scss'],
})
export class MainToolbarComponent implements OnInit {

  public backState: boolean;

  private _unsubscribe: Subject<void>;

  constructor(private menu: MenuController,
              public router: Router,
              private _cdr: ChangeDetectorRef,
              public location: Location,
              private _stateService: StateService) {
    this._unsubscribe = new Subject<void>();
    this.backState = false;
  }

  ngOnInit() {
    this._stateDataListener();
  }

  openSideBar(id: string) {
    this.menu.open(id);
  }

  private _stateDataListener(): void {
    this._stateService.stateModelListener()
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe((backState: any) => {
        this.backState = backState;

        this._cdr.markForCheck();
    });
  }
}
