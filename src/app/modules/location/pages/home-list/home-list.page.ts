import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import { IonContent, IonSearchbar } from '@ionic/angular';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import { ItemListComponent } from 'src/app/modules/shared/components/item-list/item-list.component';
import { trigger, transition, style, animate } from '@angular/animations';

import { FoodRepositoryService } from 'src/app/modules/shared/services/food.service';
import {StateService} from 'src/app/modules/shared/services/state.service';
import {getBackgroundString} from 'src/app/modules/shared/utils/imgBackground.util';
import {ConfigList} from 'src/framework/repository/api/config-list.model';

@Component({
  selector: 'home-list-page',
  templateUrl: './home-list.page.html',
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
export class HomeListPage implements OnInit, OnDestroy {

  @ViewChild('itemListComponent')
  public itemListComponent: ItemListComponent;

  @ViewChild('itemListComponent2')
  public itemListComponent2: ItemListComponent;

  @ViewChild(IonContent, { static: false })
  public content: IonContent;

  public categoryData: ConfigList;
  public module: string;
  public queryList: any;
  public searchWord: string;
  public options: any;
  public overlays: any[];
  public foodList: any[];
  public segmentTab: string;
  public tabState: boolean;
  public publicMode: boolean;

  private _unsubscribe: Subject<void>;

  constructor(private _foodRepositoryService: FoodRepositoryService,
              private _activatedRoute: ActivatedRoute,
              private _stateService: StateService,
              private _cdr: ChangeDetectorRef,
              public router: Router) {
    this._unsubscribe = new Subject<void>();
    this.tabState = false;
  }

  ngOnInit(): void {
    this.foodList = [];
    this.queryList = [
      {
        field: 'available',
        operation: '==',
        value: true
      }
    ];

    this._routeParamsListener();
    this.getFoods();
    this._tabStateDataListener();
    this._verifyPublicMode();
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  getBackgroundString(url: string) {
    return getBackgroundString(url);
  }

  setQueryList(queryList: any): void {
    this.queryList = queryList;
    this.scrollToSearchComponent();
  }

  public changeSearchWord(event: any): void {
    const words = event.target.value.toLowerCase();
    this.itemListComponent.searchWordInItems(words);
    this.itemListComponent2.searchWordInItems(words);
    this.scrollToSearchComponent();
  }

  public scrollToSearchComponent() {
    const searchComponent: any | IonSearchbar = document.getElementById('homeListSearch');
    this.content.scrollToPoint(0, 0, 1000);

    setTimeout(() => {
      searchComponent.setFocus();
    }, 800);
  }

  private _verifyPublicMode() {
    if ((localStorage.getItem('publicMode') === 'true')) {
      this.publicMode = true;
    } else {
      this.publicMode = false;
    }
  }

  private getFoods() {
    let configList: any = {
      orderByConfigList: [
        {
          field: 'order',
          direction: 'asc'
        },
        {
          field: 'name',
          direction: 'asc'
        }
      ],
      queryList: [
        {
          field: 'available',
          operation: '==',
          value: true
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

  private _routeParamsListener(): void {
    this._activatedRoute.params
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe((params: Params) => {
        this.module = params['module'];
        this._stateService.changeBackState(false);
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
