import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AnnouncementRepositoryService } from '../../services/announcementfb.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfigList } from 'src/framework/repository/api/config-list.model';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { QrViewerComponent } from '../qr-viewer/qr-viewer.component';

@Component({
  selector: 'event-list',
  templateUrl: './event-list.html'
})
export class EventListComponent implements OnInit {

  public itemList: any;
  public emptyState: any;
  public responsiveOptions: any[];
  public colors: string[];

  public configList: ConfigList;
  public ref: DynamicDialogRef;

  private _unsubscribe: Subject<void>;

  constructor(private _announcementRepositoryService: AnnouncementRepositoryService,
              private _dialogService: DialogService,
              private sanitizer: DomSanitizer,
              private _cdr: ChangeDetectorRef) {
    this._unsubscribe = new Subject<void>();
    this.colors = [
      "black-lighten",
      "red",
      "green",
      "yellow"
    ];
  }

  ngOnInit() {
    this.responsiveOptions = [
      {
        breakpoint: '1920px',
        numVisible: 4,
        numScroll: 4
      },
      {
        breakpoint: '1790px',
        numVisible: 3,
        numScroll: 3
      },
      {
          breakpoint: '1400px',
          numVisible: 2,
          numScroll: 2
      },
      {
          breakpoint: '1200px',
          numVisible: 3,
          numScroll: 3
      },
      {
          breakpoint: '991px',
          numVisible: 2,
          numScroll: 2
      },
      {
          breakpoint: '600px',
          numVisible: 1,
          numScroll: 1,
          showIndicators: false
      }
    ];

    this.configList = {
      orderByConfigList: [
        {
          field: 'date',
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
          field: 'date',
          operation: '>=',
          value: new Date()
        }
      ]
    };

    this._getEvents();
  }

  public openLink(link: string) { 
    if (link) {
      if ((localStorage.getItem('publicMode') === 'true')) {
        this._openQR(link);
      } else {
        window.open(link);
      }
    }
  }

  public safeUrlSanitizer(url: string) {
    const iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);

    return iframeUrl;
  }

  public getRandomColor(): string {
    const randomIndex = Math.floor(Math.random() * this.colors.length);
    const color = this.colors[randomIndex];

    return color;
  }

  public formatDate(timestamp: { seconds: number; nanoseconds: number }, type: string): any {
    const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
    const monthOptions: Intl.DateTimeFormatOptions = { month: 'short' };

    switch (type) {
      case 'month':
        return new Intl.DateTimeFormat('es-ES', monthOptions).format(date);
        
      case 'day':
        return date.getDate().toString();
        
      case 'time':
        return date.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          });

      case 'hour':
        return date.getDate().toString();
    
      default:
        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          });
    }
  }
  
  private _getEvents() {
    this.itemList = null;
    
    this._announcementRepositoryService.getByQuery(this.configList, 15)
    .pipe(
      takeUntil(this._unsubscribe)
    )
    .subscribe((itemList: any) => {
      this.itemList = itemList;

      this._cdr.markForCheck();
    });
  }

  private _openQR(text: string) {
    this.ref = this._dialogService.open(
      QrViewerComponent,
      { 
        header: 'Escanéame',
        data: {
          link: text
        }
      }
    );
  }
}
