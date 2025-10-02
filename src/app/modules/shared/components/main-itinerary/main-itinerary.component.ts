import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ConfigList } from 'src/framework/repository/api/config-list.model';
import { ItineraryRepositoryService } from '../../services/itinerary.service';

@Component({
  selector: 'main-itinerary',
  templateUrl: './main-itinerary.html'
})
export class MainItineraryComponent implements OnInit {

  public mainItinerary: any;
  public configList: ConfigList;

  private _unsubscribe: Subject<void>;

  constructor(private _itineraryRepositoryService: ItineraryRepositoryService,
              private _cdr: ChangeDetectorRef) {
    this._unsubscribe = new Subject<void>();
  }

  ngOnInit() {
    this.configList = {
      orderByConfigList: [
        {
          field: 'order',
          direction: 'asc'
        }
      ],
      queryList: [
        {
          field: 'available',
          operation: '==',
          value: true
        },
        {
          field: 'active',
          operation: '==',
          value: true
        }
      ]
    };

    this._getMainItinerary();
  }
  
  private _getMainItinerary() {
    this.mainItinerary = null;
    
    this._itineraryRepositoryService.getByQuery(this.configList)
    .pipe(
      takeUntil(this._unsubscribe)
    )
    .subscribe((itemList: any) => {
      if ( itemList[0] ) {
        this.mainItinerary = itemList[0];
      }

      this._cdr.markForCheck();
    });
  }
}
