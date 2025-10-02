import {ChangeDetectorRef, Component, ViewChild, ElementRef, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FoodRepositoryService} from '../../services/food.service';
import {updateScrollRightContainer, updateScrollLeftContainer} from '../../utils/swipeHammer.util';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {documentId} from '@angular/fire/firestore';

@Component({
  selector: 'food-list',
  templateUrl: './food-list.html'
})
export class FoodListComponent implements OnInit {

  @ViewChild('foodContainer')
  private _foodContainerRef: ElementRef;

  @Input()
  public foodList: any;

  @Input()
  public foodIdList: any;

  @Input()
  public redirect: boolean;

  private _unsubscribe: Subject<void>;

  constructor(private _foodRepositoryService: FoodRepositoryService,
              private _cdr: ChangeDetectorRef,
              private _router: Router) {
    this._unsubscribe = new Subject<void>();
  }

  ngOnInit(): void {
    this.redirect = true;
    this._getFoods();
  }

  public scrollRight(event: any): void {
    updateScrollRightContainer(event, this._foodContainerRef);
  }

  public scrollLeft(event: any): void {
    updateScrollLeftContainer(event, this._foodContainerRef);
  }

  public goToRoute(id: string) {
    if (this.redirect) {
      this._router.navigate(['/search/food/'+ id]);
    };
  }

  private _getFoods() {
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
      ]
    };

    if (this.foodIdList?.length > 0) {
      configList  = {
        orderByConfigList: [],
        queryList: [
          {
            field: documentId(),
            operation: 'in',
            value: this.foodIdList
          }
        ]
      };
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
}
