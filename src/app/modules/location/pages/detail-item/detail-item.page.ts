import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ModalController} from '@ionic/angular';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {AttractionRepositoryService} from 'src/app/modules/shared/services/attraction.service';
import {RestaurantRepositoryService} from 'src/app/modules/shared/services/restaurant.service';
import {PocketBaseService} from 'src/app/modules/shared/services/pocket-base.service';
import {Location} from '@angular/common';

import {StateService} from 'src/app/modules/shared/services/state.service';
import {getBackgroundString} from 'src/app/modules/shared/utils/imgBackground.util';
import {DeliveryIframeComponent} from '../../components/delivery-iframe/delivery-iframe';

@Component({
  selector: 'detail-item-page',
  templateUrl: './detail-item.page.html'
})
export class DetailItemPage implements OnInit, OnDestroy {

  public module: string;
  public itemId: string;
  public item: any;
  public scrollY!: number;
  public presentingElement: any = undefined;
  public showHistory: boolean = false;

  private _unsubscribe: Subject<void>;
  
  constructor(private _attractionRepositoryService: AttractionRepositoryService,
              private _restaurantRepositoryService: RestaurantRepositoryService,
              private _pocketBaseService: PocketBaseService,
              private _modalController: ModalController,
              private _activatedRoute: ActivatedRoute,
              private _stateService: StateService,
              private _cdr: ChangeDetectorRef,
              public location: Location,
              public router: Router) {
    this._unsubscribe = new Subject<void>();
  }

  ngOnInit(): void {
    this.item = null;
    this._stateService.changeTabState(true);
    this._stateService.changeBackState(false);
    this._routeParamsListener();
    this.presentingElement = document.querySelector('.embed-container');
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  getBackgroundString(url: string) {
    return getBackgroundString(url);
  }

  onScroll(event: any) {
    this.scrollY = event.detail.scrollTop;
  }

  openLink(link: string): any {
    window.open(link);
  }

  public async openModal(link: string) {
    const actionSheet = await this._modalController.create({
      component: DeliveryIframeComponent,
      componentProps: {
        link: link
      }
    });

    actionSheet.present();
  }

  private _getItem(): void {
    let service: any;

    switch (this.module) {
      case 'attractions':
        service = this._attractionRepositoryService;
        break;

      case 'restaurants':
        service = this._restaurantRepositoryService;
        break;
    }

    service.getById(this.itemId)
    .pipe(
        takeUntil(this._unsubscribe)
    )
    .subscribe((item: any) => {
      this.item = item;
      this._getHistoryData();

      this._cdr.markForCheck();
    });
  }

  private _getHistoryData() {
    if (this.item.historyId) {
      this._pocketBaseService.getById(this.item.historyId).subscribe(
        (record) => {
          this.item.history_data = record.history_data;
          this.item.history_data.description = record.history_description;
        },
        (error) => {
          console.error('Error obteniendo el registro:', error);
        }
      );
    }
  }

  private _routeParamsListener(): void {
    this._activatedRoute.params
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe((params: Params) => {
        this.module = params['module'];
        this.itemId = params['itemId'];
        this._getItem();
      });
  }
}
