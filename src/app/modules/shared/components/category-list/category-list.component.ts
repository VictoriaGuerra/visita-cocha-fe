import { CategoryRepositoryService } from './../../services/main-category.repository-service';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { ConfigList } from 'src/framework/repository/api/config-list.model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { updateScrollRightContainer, updateScrollLeftContainer } from '../../utils/swipeHammer.util';

@Component({
  selector: 'category-list',
  templateUrl: './category-list.html'
})
export class CategoryListComponent implements OnInit, OnDestroy {

  @ViewChild('categoriesContainer')
  private _categoriesContainerRef: ElementRef;

  @Input()
  public selectedCategory: string;

  public configList: ConfigList;
  public categoryList: any;

  private _unsubscribe: Subject<void>;

  constructor(private _categoryRepositoryService: CategoryRepositoryService,
              private cdr: ChangeDetectorRef) {
    this._unsubscribe = new Subject<void>();
  }

  ngOnInit() {
    this.categoryList = null;
    this.configList = {
      queryList: [
        {
          field: 'available',
          operation: '==',
          value: true
        }
      ],
      orderByConfigList: [
        {
          field: 'order',
          direction: 'asc'
        },
        {
          field: 'name',
          direction: 'asc'
        }
      ]
    };
    this._getCategories();
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  public scrollRight(event: any): void {
    updateScrollRightContainer(event, this._categoriesContainerRef);
  }

  public scrollLeft(event: any): void {
    updateScrollLeftContainer(event, this._categoriesContainerRef);
  }

  private _getCategories(): void {
    this._categoryRepositoryService.getByQuery(this.configList)
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe((categoryList: any) => {
        this.categoryList = categoryList;
        this._removeSelectedCategory();
        this.cdr.markForCheck();
      });
  }

  private _removeSelectedCategory() {
    if (this.selectedCategory) {
      this.categoryList  = this.categoryList.filter((category: any) => category.id !== this.selectedCategory);
    }
  }
}
