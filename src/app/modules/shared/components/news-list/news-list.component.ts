import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ConfigList } from 'src/framework/repository/api/config-list.model';
import { Subject, takeUntil } from 'rxjs';
import { getBackgroundGradientString, getBackgroundString } from '../../utils/imgBackground.util';
import { Platform } from '@ionic/angular';
import { QrViewerComponent } from '../qr-viewer/qr-viewer.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { HttpClient } from '@angular/common/http';
import { AnnouncementService } from '../../services/announcement.service';
@Component({
  selector: 'news-list',
  templateUrl: './news-list.html'
})
export class NewsListComponent implements OnInit {
  
  @Input()
  public vertical: boolean;

  public isVideoPlaying: boolean;

  public configList: ConfigList;
  public itemList: any;
  public emptyState: any;
  public ref: DynamicDialogRef;
  public bannerList: any[];
  public months: string[];

  private _unsubscribe: Subject<void>;

  constructor(private _announcementRepositoryService: AnnouncementService,
              private _dialogService: DialogService,
              private _platform: Platform,
              private _httpClient: HttpClient,
              private _cdr: ChangeDetectorRef) {
    this._unsubscribe = new Subject<void>();
    this.bannerList = [
      {
        src: 'https://firebasestorage.googleapis.com/v0/b/cocha-turismo.appspot.com/o/images%2Fimage%2014_iphone13blue_portrait.png?alt=media&token=1c055708-22fc-444e-9e94-d12e9e04bbf9',
        alt: 'Innova App',
        bgColor: 'uch-bg--secondary',
        text: 'Prueba Innova ya!',
        buttonText: 'Descargar',
        link: null,
        textStyle: 'uch-txt--white text-2xl'
      },
      {
        src: 'https://firebasestorage.googleapis.com/v0/b/cocha-turismo.appspot.com/o/images%2FGroup.png?alt=media&token=eeb05a7a-3cc8-40a9-90d4-031b22c9b8a0',
        alt: 'Cocha Somos Innovación',
        bgColor: 'uch-bg--white',
        text: 'Cocha Somos Innovación!',
        buttonText: 'Visitar página',
        link: 'https://www.cochabamba.bo',
        textStyle: 'hidden'
      },
      {
        src: 'https://firebasestorage.googleapis.com/v0/b/cocha-turismo.appspot.com/o/images%2Fstudy.png?alt=media&token=a86b6492-581d-4103-9e4f-29776e7126bb',
        alt: 'Study Cochabamba',
        bgColor: 'uch-bg--white',
        text: 'Cochabamba es la primera "Ciudad Universitaria" de Bolivia!',
        buttonText: 'Visitar página',
        link: 'https://studycochabamba.com',
        textStyle: 'font-normal text-xl'
      },
      {
        srcBg: 'https://firebasestorage.googleapis.com/v0/b/cocha-turismo.appspot.com/o/banners%2Facoso.png?alt=media&token=00d32540-bc9c-4b8e-b553-0328d46e9b5e',
        alt: '',
        src: '',
        bgColor: 'uch-bg--white',
        text: '',
        buttonText: '',
        link: '',
        textStyle: ''
      },
      {
        srcBg: 'https://firebasestorage.googleapis.com/v0/b/cocha-turismo.appspot.com/o/banners%2Fbike1.jpg?alt=media&token=f65419b4-0fa2-433d-bb3d-e424152c6359',
        alt: '',
        src: '',
        bgColor: 'uch-bg--white',
        text: '',
        buttonText: '',
        link: '',
        textStyle: ''
      },
      {
        srcBg: 'https://firebasestorage.googleapis.com/v0/b/cocha-turismo.appspot.com/o/banners%2Facoso1.png?alt=media&token=588d8bd0-a8f8-43a7-a4c0-ec069e8b3b58',
        alt: '',
        src: '',
        bgColor: 'uch-bg--white',
        text: '',
        buttonText: '',
        link: '',
        textStyle: ''
      },
      {
        srcBg: 'https://firebasestorage.googleapis.com/v0/b/cocha-turismo.appspot.com/o/banners%2Fbike.jpg?alt=media&token=8afb8aee-474f-4cf1-9960-f4c2080d1ce5',
        alt: '',
        src: '',
        bgColor: 'uch-bg--white',
        text: '',
        buttonText: '',
        link: '',
        textStyle: ''
      }
    ];
    this.months = [
      "Ene", "Feb", "Mar", "Abr",
      "May", "Jun", "Jul", "Ago",
      "Sep", "Oct", "Nov", "Di"
    ];
    this.isVideoPlaying = false;
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
        }
      ]
    };

    this.emptyState = {
      imgUrl: '../../../../../assets/images/empty-states/search.svg',
      message: 'No hay Noticias disponibles en este momento'
    };

    this._getAnnouncements();
  }

  public openLink(slug: string) {
    const link: string = 'https://www.cochabamba.bo/noticias/' + slug;
    if ((localStorage.getItem('publicMode') === 'true') && link) {
      this.ref = this._dialogService.open(
        QrViewerComponent,
        { 
          header: 'Escanéame',
          data: {
            link: link
          }
        }
      );
    } else {
      window.open(link);
    }
  }

  public getMonth(date: any) {
    const itemDate = new Date(date);
    const month = this.months[itemDate.getMonth()];
    
    return month;
  }

  public getDay(date: any) {
    return date?.split("-")?.pop();
  }

  public redirectLink(link: any) {
    const redirectionLink: any = this._getRedirectionLink(link);

    if (localStorage.getItem('publicMode') === 'true') {
      this.ref = this._dialogService.open(
        QrViewerComponent,
        { 
          header: 'Escanéame',
          data: {
            link: redirectionLink
          }
        }
      );
    } else {
      window.open(redirectionLink);
    }
  }

  public setVideoStartTime(video: HTMLVideoElement, startTime: number) {
    video.currentTime = startTime;
  }

  public onVideoPlay() {
    this.isVideoPlaying = true;
  }

  public onVideoPause() {
    this.isVideoPlaying = false;
  }

  private _getRedirectionLink(link: any): any {
    let redirectionLink: any ='https://innova.cochabamba.bo/login';

    if (link === null) {
      if (this._platform.is('ios')) {
        redirectionLink = 'https://apps.apple.com/bo/app/innova-cochabamba/id1596809179?l=en';
      }
      if (this._platform.is('android')) {
        redirectionLink = 'https://play.google.com/store/apps/details?id=bo.innova.gamc&hl=es_BO&gl=US&pli=1';
      }
      if (this._platform.is('desktop')) {
        redirectionLink = 'https://innova.cochabamba.bo/login';
      }
    } else {
      redirectionLink = link;
    }

    return redirectionLink;
  }

  getBackground(file: string): string {
    const url: string = 'https://www.cochabamba.bo/' + file;
    
    return getBackgroundString(url);
  }

  getVideoLink(file: string): string {
    const url: string = 'https://www.cochabamba.bo/' + file;
    
    return url;
  }

  verifyMP4Extension(path: string) {
    let extension = path?.split('.')?.pop()?.toLowerCase();
    
    return extension === 'mp4';
  }

  private _getAnnouncements() {
    this.itemList = null;
    
    this._announcementRepositoryService.getLastNews()
    .pipe(
      takeUntil(this._unsubscribe)
    )
    .subscribe((itemList: any) => {
      this.itemList = itemList;
      
      this._cdr.markForCheck();
    });
  }
}