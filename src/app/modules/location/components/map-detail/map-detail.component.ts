import { Component, OnInit, Input, ChangeDetectorRef, HostListener, OnChanges, SimpleChanges } from '@angular/core';
import { BlockableUI } from 'primeng/api';
import * as L from 'leaflet';
import { QrViewerComponent } from 'src/app/modules/shared/components/qr-viewer/qr-viewer.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';


@Component({
  selector: 'map-detail',
  templateUrl: './map-detail.html'
})
export class MapDetailComponent implements OnInit, BlockableUI, OnChanges {

  @Input()
  public item: any;

  @Input()
  public scrollY: any;

  public ref: DynamicDialogRef;

  @HostListener('document:click', ['$event'])
  listenerMap(event: any) {
    const container = event.target.closest('.uch-map-container');
    this.prevScroll = this.scrollY;

    if (!container) {
      this.isMapHidden = true;
    } else {
      this.isMapHidden = false;
    }
    this._cdr.markForCheck();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.prevScroll && this.prevScroll !== changes.scrollY?.currentValue) {
      this.isMapHidden = true;
    }
  }

  public isMapHidden: boolean;
  public leafletMap: L.Map;
  public prevScroll:  any;
  public navigator: any

  constructor(private _dialogService: DialogService,
              private _cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.isMapHidden = true;
  }

  ngAfterViewInit() {
    if (!this.leafletMap) {
      this._initMap(this.item?.location?.coords.lat, this.item?.location?.coords.lng);
    }
  }

  private _initMap(lat: number, lng: number) {
    this.leafletMap = L.map('mapDetail-'+this.item.id).setView([lat, lng], 18);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.leafletMap);

    this.markPointOnMap();

    this._cdr.markForCheck();
  }

  getBlockableElement(): HTMLElement {
    throw new Error('Method not implemented.');
  }

  async openGmapLink(): Promise<void> {
    let url: string = '';
    try {
      if ('geolocation' in navigator) {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
  
        if (position) {
          url = `https://www.google.com/maps/dir/${position.coords.latitude},${position.coords.longitude}/${this.item?.location?.coords.lat},${this.item?.location?.coords.lng}`;
  
          if (localStorage.getItem('publicMode') === 'true') {
            this.ref = this._dialogService.open(
              QrViewerComponent,
              {
                header: 'Escanéame',
                data: {
                  link: url
                }
              }
            );
          } else {
            window.open(url);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  public markPointOnMap(): any {
    let count = 0;

    this.leafletMap?.eachLayer((layer: L.Layer) => {
      if (count > 0) {
        layer.remove();
      } else {
        count++;
      }
    });

    const customIcon = new L.Icon({
      iconUrl: 'https://firebasestorage.googleapis.com/v0/b/cocha-turismo.appspot.com/o/icons%2FVector.svg?alt=media&token=d3f411dc-9766-452c-a90d-7ab8e955451e',
      iconSize: [20, 50]
    });

    const popupContent = `
        <div>
          <img class="border-round-xl"
               src="${this.item?.coverUrl}"
               alt="${this.item?.name} photo">
          <h4 class="mt-1 mb-0">${this.item?.name}</h4>
        </div>
      `;

    L?.marker([Number(this.item?.location?.coords?.lat), Number(this.item?.location?.coords?.lng)], {icon: customIcon })
    .addTo(this.leafletMap)
    .bindPopup(popupContent);
  }

}
