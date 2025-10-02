import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, Input} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {IonContent} from '@ionic/angular';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {FoodRepositoryService} from 'src/app/modules/shared/services/food.service';
import {StateService} from 'src/app/modules/shared/services/state.service';
import {getBackgroundString} from 'src/app/modules/shared/utils/imgBackground.util';

@Component({
  selector: 'detail-food-page',
  templateUrl: './detail-food.page.html'
})
export class DetailFoodPage implements OnInit, OnDestroy {

  @ViewChild('pageTop')
  public pageTop: IonContent;

  @Input()
  public itemId: any;

  public module: string;
  public foodId: string;
  public item: any;
  public foodList: any[];
  public queryList: any;

  private _unsubscribe: Subject<void>;

  constructor(private _foodRepositoryService: FoodRepositoryService,
              private _activatedRoute: ActivatedRoute,
              private _stateService: StateService,
              private _cdr: ChangeDetectorRef,
              public router: Router) {
    this._unsubscribe = new Subject<void>();
    this.foodList = [];
  }

  ngOnInit(): void {
    this.item = null;
    this.foodList = [];
    this._stateService.changeTabState(true);
    this._routeParamsListener();
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  getBackgroundString(url: string) {
    return getBackgroundString(url);
  }

  private getFoods() {
    let configList: any = {
      orderByConfigList: [
        {
          field: 'name',
          direction: 'asc'
        },
        {
          field: 'order',
          direction: 'asc'
        }
      ],
      queryList: [
        {
          field: 'name',
          operation: '!=',
          value: this.item.name
        }
      ]
    };

    this._foodRepositoryService.getByQuery(configList)
    .pipe(
      takeUntil(this._unsubscribe)
    )
    .subscribe((foodList: any) => {
      this.foodList = foodList;

      this._cdr.markForCheck();
    });
  }

  public getItem(): void {
    let id: string = this.foodId? this.foodId: this.itemId;
    this._foodRepositoryService.getById(id)
    .pipe(
      takeUntil(this._unsubscribe)
    )
    .subscribe((food: any) => {
      this.item = food;

      this.queryList = [
        {
          field: 'foods',
          operation: 'array-contains',
          value: food.id
        },
        {
          field: 'available',
          operation: '==',
          value: true
        }
      ];
      
      this.getFoods();
      this.pageTop.scrollToTop(400);

      this._cdr.markForCheck();
    });
  }

  private _routeParamsListener(): void {
    this._activatedRoute.params
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe((params: Params) => {
        this.foodId = params['foodId'];
        this.getItem();
      });
  }
}
