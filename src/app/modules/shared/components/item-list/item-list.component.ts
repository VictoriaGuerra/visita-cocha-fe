import { Component, OnInit, Input, ChangeDetectorRef, Output, EventEmitter, ViewChild, ElementRef, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Subject, takeUntil, tap } from 'rxjs';
import { AttractionRepositoryService } from 'src/app/modules/shared/services/attraction.service';
import { RestaurantRepositoryService } from 'src/app/modules/shared/services/restaurant.service';
import { updateScrollLeftContainer, updateScrollRightContainer } from 'src/app/modules/shared/utils/swipeHammer.util';
import { ConfigList } from 'src/framework/repository/api/config-list.model';
import { trigger, transition, style, animate } from '@angular/animations';
import { AttractionRepositoryService2 } from '../../services/attraction2.service';

@Component({
  selector: 'item-list',
  templateUrl: './item-list.html',
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        animate('0.3s ease-in-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class ItemListComponent implements OnInit, OnDestroy, OnChanges {

  @ViewChild('itemsContainer')
  private _itemsContainer: ElementRef | any;

  @Input()
  public module: string;

  @Input()
  public queryList: any;

  @Input()
  public excludeId: any;

  @Input()
  public reverse: boolean;

  @Output()
  public overlays: EventEmitter<any>;

  @Output()
  public overlaysLeaflet: EventEmitter<any>;


  public itemsFilteredList: any[];
  public category: any;
  public configList: ConfigList;
  public itemList: any;
  public itemListCopyBase: any;
  public emptyState: any;
  public isArrowHidden: boolean;
  public quantityToShowArrow: number;

  private _unsubscribe: Subject<void>;

  constructor(private _attractionRepositoryService: AttractionRepositoryService,
              private _restaurantRepositoryService: RestaurantRepositoryService,
              private _cdr: ChangeDetectorRef,
              private _platform: Platform) {
    this._unsubscribe = new Subject<void>();
    this.overlaysLeaflet = new EventEmitter<any>();
    this.isArrowHidden = false;
  }

  ngOnInit() {
    this._getItems();
    this.configList = {
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
      ]
    };

    this.emptyState = {
      imgUrl: '../../../../../assets/images/empty-states/search.svg',
      message: 'No hay coincidencias con la búsqueda'
    };

    this._initArrowQuantity();
  }

  ngOnChanges(): void {
    if (this.queryList?.length > 0) {
      this.configList = {
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
        queryList: this.queryList
      };
    }

    if (this.queryList?.length === 0) {
      this.configList = {
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
        queryList: []
      };
    }

    this._getItems();
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  public scrollRight(event: any): void {
    updateScrollRightContainer(event, this._itemsContainer);
    this.slideFromArrow();
  }

  public scrollLeft(event: any): void {
    updateScrollLeftContainer(event, this._itemsContainer);
    this.slideFromArrow();
  }

  public searchWordInItems(word: string): void {
    this.itemList = null;

    if (word === '') {
      this.itemList = this.itemListCopyBase;
    } else {
      this.itemList = this.itemListCopyBase?.filter((obj: any) => (obj.name).toLowerCase().includes(word));
    }
    this._cdr.markForCheck();
  }

  public slideFromArrow(space?: number) {
    const itemClass = this.module + 'ItemsContainer';
    const elements = document.getElementsByClassName(itemClass);
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].scrollLeft + elements[i].clientWidth >= elements[i].scrollWidth) {
        this.isArrowHidden = true;
      } else {
        this.isArrowHidden = false;
        if (space) {
          elements[i].scrollLeft += space;
        }
      }
    }
  }

  private _getItems(): void {
    this._setQueryByInput();
    this._setAvailableQuery();

    this.itemList = null;
    let service: any;

    switch (this.module) {
      case 'attractions':
        service = this._attractionRepositoryService;
        break;

      case 'restaurants':
        service = this._restaurantRepositoryService;
    };

    if (!this.configList) {
      this.configList = {
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
    }
    
    service.getByQuery(this.configList)
        .pipe(
          takeUntil(this._unsubscribe)
        )
        .subscribe((itemList: any) => {
          this.itemList = itemList;

          this._removeExcludedId();

          if (this.reverse) {
            itemList.reverse();
          };
          
          this.itemListCopyBase = itemList;

          this._emitOverlays();
          this.setArrowState();

          this._cdr.markForCheck();
        });
  }

  private _removeExcludedId() {
    if (this.excludeId) {
      this.itemList  = this.itemList.filter((location: any) => location.id !== this.excludeId);
    }
  }

  private _setQueryByInput() {
    if (this.queryList?.length > 0) {
      this.configList.queryList = this.queryList
    };
  }

  private _emitOverlays() {
    let overlaysL = [];

    if (this.itemList.length > 0) {
      for (let i = 0; i < this.itemList.length; i++) {
        if (this.itemList[i]?.location?.coords?.lat !== 0 && this.itemList[i]?.location?.coords?.lat) {
          this.itemList[i].type = this.module;
          overlaysL.push(this.itemList[i]);
        }
      }

      this.overlaysLeaflet.emit(overlaysL);
    }
  }

  private _setAvailableQuery() {
    const availableQuery = {
      field: 'available',
      operation: '==',
      value: true
    };

    if (!this.queryList?.includes(availableQuery)) {
      this.queryList?.push(availableQuery);

      if (this.configList?.queryList) {
        this.configList.queryList = this.queryList;
      }
    }
  }

  private _initArrowQuantity() {
    let isMobile = this._platform.is('mobile');

    if (isMobile) {
      this.quantityToShowArrow = 2;
    } else {
      this.quantityToShowArrow = 4;
    }
  }

  private setArrowState() {
    if (this.itemList.length <= this.quantityToShowArrow) {
      this.isArrowHidden = true;
    } else {
      this.isArrowHidden = false;
    }
  }
}
