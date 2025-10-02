import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {CategoryRepositoryService} from 'src/app/modules/shared/services/main-category.repository-service';
import {StateService} from 'src/app/modules/shared/services/state.service';

@Component({
  selector: 'search-list-page',
  templateUrl: './search-list.page.html'
})
export class SearchListPage implements OnInit, OnDestroy {

  public categoryData: any;
  public module: string;
  public queryList: any;
  public selectedTab: any;
  public categoryId: string;

  private _unsubscribe: Subject<void>;

  constructor(private _categoryRepositoryService: CategoryRepositoryService,
              private _activatedRoute: ActivatedRoute,
              private _stateService: StateService,
              private _cdr: ChangeDetectorRef,
              public location: Location,
              public router: Router) {
    this._unsubscribe = new Subject<void>();
    this.categoryData = null;
  }

  ngOnInit(): void {
    this.selectedTab = 'attractions';
    this.module = 'attractions';

    this._routeParamsListener();
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  setQueryList(queryList: any): void {
    this.queryList = queryList;
  }

  public changeTab(event: any): void {
    this.selectedTab = event.detail.value;
    this.module = event.detail.value;

    this.queryList = [
      {
        field: 'mainCategories',
        operation: 'array-contains',
        value: this.categoryId
      }
    ];

    this._cdr.markForCheck();
  }

  private _routeParamsListener(): void {
    this._activatedRoute.params
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe((params: Params) => {
        this.categoryId = params['categoryId'];
        this._stateService.changeBackState(false);

        this._getCategory();
      });
  }

  private _getCategory(): void {
    this._categoryRepositoryService.getById(this.categoryId)
    .pipe(
      takeUntil(this._unsubscribe)
    )
    .subscribe((category: any) => {
      this.categoryData = category;

      if (this.categoryData.id) {
        this.queryList = [
          {
            field: 'mainCategories',
            operation: 'array-contains-any',
            value: [this.categoryId]
          }
        ];
      }

      this._cdr.markForCheck();
    });
  }
}
