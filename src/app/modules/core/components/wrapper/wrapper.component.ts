import { ChangeDetectorRef, Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { Subject, takeUntil } from 'rxjs';
import { StateService } from 'src/app/modules/shared/services/state.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.scss'],
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.3s ease-in-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('0.3s ease-in-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class WrapperComponent implements OnInit, OnDestroy {

  @ViewChild(IonContent, { static: false })
  public content: IonContent;

  public backState: boolean;
  public tabState: boolean;
  private _unsubscribe: Subject<void>;

  constructor(public router: Router,
              private _stateService: StateService,
              private _cdr: ChangeDetectorRef) {
    this.backState = false;
    this.tabState = false;
    this._unsubscribe = new Subject<void>();
  }

  ngOnInit() {
    this._stateDataListener();
    this._tabStateDataListener();
  }

  ionViewDidEnter() {
    this.content.scrollToTop(1500);
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
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

  private _tabStateDataListener(): void {
    this._stateService.tabStateModelListener()
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe((tabState: any) => {
        this.tabState = tabState;

        this._cdr.markForCheck();
    });
  }

}
