import { Component, OnInit, Input, ChangeDetectorRef, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { AttractionCategoryRepositoryService } from 'src/app/modules/shared/services/attraction-category.service';
import { RestaurantCategoryRepositoryService } from 'src/app/modules/shared/services/restaurant-category.service';
import { ConfigList, WhereConfig } from 'src/framework/repository/api/config-list.model';

@Component({
  selector: 'home-category-list',
  templateUrl: './home-category-list.html'
})
export class HomeCategoryListComponent implements OnInit, OnDestroy {

  @Input()
  public module: string;

  @Output()
  public query: EventEmitter<any>;

  public items: MenuItem[];
  public selectedTab: any;
  public configList: ConfigList;
  public categoryList: any;
  public queryList: WhereConfig[];

  private _unsubscribe: Subject<void>;

  constructor(private _attractionCategoryRepositoryService: AttractionCategoryRepositoryService,
              private _restaurantCategoryRepositoryService: RestaurantCategoryRepositoryService,
              private _cdr: ChangeDetectorRef) {
    this._unsubscribe = new Subject<void>();
    this.query = new EventEmitter<any>();
  }

  ngOnInit() {
    this.items = [
    ];

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

    this._getCategories();
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  publicEmitQuery(target: any, label?: string): void {
    this.queryList = [];

    if (target?.tagName !== 'UL' || label) {
      switch (target?.innerText || label) {
        case 'Todos':
          this.queryList = [
            {
              field: 'available',
              operation: '==',
              value: true
            }
          ];
          break;

        case 'Recomendado':
          this.queryList.push({
            field: 'isFeatured',
            operation: '==',
            value: true
          });
          break;

        default:
          let categoryId: string = this._getCategoryId(target?.innerText || label);

          if (categoryId) {
            this.queryList.push({
              field: 'categories',
              operation: 'array-contains',
              value: categoryId
            });
          }
          break;
      };

      this.query.emit(this.queryList);
    }
  }

  private _getCategoryId(name: string): string {
    let categoryId: any;

    categoryId = (this.categoryList?.find((item: any) => item.name === name))?.id;

    return categoryId;
  }

  private _getCategories(): void {
    this.configList.queryList?.push({
      field: 'available',
      operation: '==',
      value: true
    });
    
    switch (this.module) {
      case 'attractions':
        this._attractionCategoryRepositoryService.getByQuery(this.configList)
        .pipe(
          takeUntil(this._unsubscribe)
        )
        .subscribe((categoryList: any) => {
          this.categoryList = categoryList;

          this._buildCategoryTabItems();
          this._cdr.markForCheck();
        });
        break;

      case 'restaurants':
        this._restaurantCategoryRepositoryService.getByQuery(this.configList)
        .pipe(
          takeUntil(this._unsubscribe)
        )
        .subscribe((categoryList: any) => {
          this.categoryList = categoryList;

          this._buildCategoryTabItems();
          this._cdr.markForCheck();
        });
        break;
    }
  }

  private _buildCategoryTabItems(): void {
    this.items = [];
    this.items.push({label: 'Todos'});
    this.items.push({label: 'Recomendado'});

    const transformedCateogries = this.categoryList.map((category: any) => ({ label: category.name }));
    this.items = this.items.concat(transformedCateogries);
    this.selectedTab = this.items[0];
  }
}
