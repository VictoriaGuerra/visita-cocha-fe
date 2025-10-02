import {ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import {StateService} from 'src/app/modules/shared/services/state.service';
import * as L from 'leaflet';
import {InfoMapComponent} from '../../components/info-map/info-map.component';
import {Lines} from '../../constants/lines';
import {ModalController} from '@ionic/angular';
import {christmasIcon, lineIcon, userLocationIcon} from 'src/app/modules/shared/constants/map-icons';
import {HttpClient} from '@angular/common/http';
import {updateScrollLeftContainer, updateScrollRightContainer} from 'src/app/modules/shared/utils/swipeHammer.util';

@Component({
  selector: 'map-event-page',
  templateUrl: './map-event.component.html'
})
export class MapEventComponent implements OnInit, OnDestroy {

  @ViewChild('linesContainer')
  private _linesContainer: ElementRef | any;

  public module: any;
  public items: any[] = Lines;
  public leafletMap: L.Map;
  public position: any;
  public list: any[] = [];
  public linesListOptions: any[] = [];
  public selectedLine: any;
  
  private _unsubscribe: Subject<void>;

  constructor(private _modalController: ModalController,
              private _stateService: StateService,
              private _cdr: ChangeDetectorRef,
              private _http: HttpClient,
              public router: Router) {
    this._unsubscribe = new Subject<void>();
  }

  ngOnInit(): void {
    this.position = null;
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  ionViewWillEnter() {
    this._stateService.changeBackState(true);
    this._initMap();
  }

  ionViewDidLeave() {
    this._stateService.changeBackState(false);
  }

  private _initMap() {
    this.leafletMap = this._createMap();

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.leafletMap);

    this.leafletMap.on('compassNeedleMove', (event: any) => {
      this.leafletMap.setView(event.bearing, 1);
    });

    this.getLocation();
    this._loadGeoJsonFiles(121);
  }

  private _createMap() {
    return new L.Map('map', {
      center: [-17.407988205059414, -66.14321049797577],
      zoom: 14
    });
  }

  public setMapPosition(): any {
    this.leafletMap?.setView([Number(this.position.coords?.latitude), Number(this.position.coords?.longitude)],15);
  }

  // Improve Get Permission and controls
  public async getLocation(): Promise<any> {
    try {
      if ('geolocation' in navigator) {
        this.position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        if (this.position && this.leafletMap) {
          // this._markModulePins();
          // this.addFairLocation();
          this.addUserLocation();
        }
      }
    } catch (error) {
      console.log(error);
      // this._markModulePins();
      // this.addFairLocation();
      this.position = null;
    }
  }

  public addUserLocation(): any {
    const popupContent = `
      <div>
        <h4 class="mt-1 mb-0">Estas aquí</h4>
      </div>
    `;

    L?.marker([Number(this.position.coords?.latitude), Number(this.position.coords?.longitude)], {icon: this._getIcon('userLocation') })
    .addTo(this.leafletMap)
    .bindPopup(popupContent);

    this._cdr.markForCheck();
  }

  public addFairLocation(): any {
    let url = `https://www.google.com/maps/dir/${Number(this.position?.coords?.latitude)},${Number(this.position?.coords?.longitude)}/-17.418217829010455,-66.13010813345625`;
    let button = '';

    if (this.position) {
      button = `<ion-button class="mt-3"
                            color="secondary"
                            expand="block"
                            size="small"
                            target="_blank""
                            href="${url}">
                  <ion-icon slot="start" name="map-outline" class="mr-1"></ion-icon>
                  Como llegar
                </ion-button>`;
    };

    const popupContent = `
      <div>
        <h4 class="mt-1 mb-0">Feria navideña</h4>
      </div>
      
      ${button}`;

    L?.marker([Number(-17.418217829010455), Number(-66.13010813345625)], {icon: this._getIcon('christmas') })
    .addTo(this.leafletMap)
    .bindPopup(popupContent);

    this._cdr.markForCheck();
  }

  public async openInfoModal() {
    // let infoList = this.getInfoList();
    let infoList = this.getLineInfo();
    
    const actionSheet = await this._modalController.create({
      component: InfoMapComponent,
      componentProps: {
        data: infoList
      },
      initialBreakpoint: .4,
      breakpoints: [0, .4]
    });

    actionSheet.present();
  }

  public getInfoList(): any {
    return {
      infoList: [
        {
          name: 'Feria navideña',
          icon: this._getIcon('christmas')
        },
        {
          name: 'Paradas de transporte',
          icon: this._getIcon('car')
        }
      ],
      text: 'Selecciona un punto en el mapa para ver más información y como llegar al lugar.'
    }
  }

  public getLineInfo(): any {
    return {
      infoList: [
        {
          name: this.selectedLine?.name,
          icon: this._getIcon('car')
        }
      ],
      text: 'Selecciona un transporte para visulizar su ruta y detalles.',
      rutes: this.selectedLine?.rutes
    }
  }

  private _markModulePins(): void {
    let count = 0;

    this.leafletMap?.eachLayer((layer: L.Layer) => {
      if (count > 0) {
        layer.remove();
      } else {
        count++;
      }
    });

    for (let i = 0; i < this.items.length; i++) {
      let url = `https://www.google.com/maps/dir/${Number(this.position?.coords?.latitude)},${Number(this.position?.coords?.longitude)}/${this.items[i]?.location?.coords.lat},${this.items[i]?.location?.coords.lng}`;
      let button = '';

      if (this.position) {
        button = `<ion-button class="mt-1"
                              color="secondary"
                              expand="block"
                              size="small"
                              target="_blank""
                              href="${url}">
                    <ion-icon slot="start" name="map-outline" class="mr-1"></ion-icon>
                    Como llegar
                  </ion-button>`;
      };

      const popupContent = `
          <div>
            <section class="flex gap-1">
              <img class="w-2rem h-2rem"
                   src="${this.items[i]?.icon}"
                   alt="${this.items[i]?.name} photo">

              <h4 class="mt-1 mb-0 uch-txt--black">${this.items[i]?.name}</h4>
            </section>

            <small class="uch-txt--black" style="font-size: 14px">
              ${this.items[i]?.location.address}
            </small>

            <section>
              <h6 class="text-sm mb-0 uch-txt--black-lighten font-normal">
                Líneas disponibles
              </h4>
              
              <p class="mt-1 mb-3 text-xl">
                ${this.items[i]?.lines}
              </p>
            </section>

            ${button}
          </div>
        `;

      if (Number(this.items[i]?.location?.coords?.lat) && Number(this.items[i]?.location?.coords?.lng)) {
        L?.marker([Number(this.items[i]?.location?.coords?.lat), Number(this.items[i]?.location?.coords?.lng)], {icon: this._getIcon('car') })
        .addTo(this.leafletMap)
        .bindPopup(popupContent);
      }

    };

    if (this.position) {
      this.addUserLocation();
    };
  }

  private _getIcon(iconName: string): any {
    switch (iconName) {
      case 'car':
        return lineIcon;

      case 'userLocation':
        return userLocationIcon;

      case 'christmas':
        return christmasIcon;
    }
  }

  private _loadGeoJsonFiles(size: number): any {
    for (let i = 2; i <= size; i++) {
      const filePath = `assets/GeoJSON/individual-rutes/ruta_${i}.geojson`;
      this._http.get(filePath).subscribe((geoJson: any) => {
        this.list.push(geoJson);
        this.linesListOptions.push(this._getLineRute(geoJson));

        this._cdr.markForCheck();
      }, error => {
          console.error(`Error al cargar el archivo: ${filePath}`, error);
      });
    }
  }

  public loadGeoJsonLine(index: number): any {
    let count = 0;

    this.leafletMap?.eachLayer((layer: L.Layer) => {
      if (count > 0) {
        layer.remove();
      } else {
        count++;
      }
    });

    L.geoJSON(this.list[index], {
      style: (feature: any) => {
        if (feature?.properties?.color) {
          const color = feature?.properties?.color;
          return {
            color: color
          };
        } else {
          return {}
        }
      }
    }).addTo(this.leafletMap);

    this.selectedLine = this.linesListOptions[index];

    const elements = document.getElementsByClassName('line');
    for (let i = 0; i < elements.length; i++) {
      if (i === index) {
        elements[i].classList.add('line-selected');
      } else {
        elements[i].classList.remove('line-selected');
      }
    }

    this.addUserLocation();
  }
;
  private _getLineRute(geoJson: any): any {
    let rutes = [];

    for (let i = 0; i < geoJson.features.length; i++) {
      rutes.push(geoJson.features[i]?.properties?.Name);
    }

    return {
      name: geoJson.name,
      rutes: rutes
    }
  }

  private _markLineRute(geoJson: any) {
    L.geoJSON(geoJson, {
      style: (feature: any) => {
        if (feature?.properties?.color) {
          const color = feature?.properties?.color;
          return {
            color: color
          };
        } else {
          return {}
        }
      }
    }).addTo(this.leafletMap);
  }

  public scrollRight(event: any): void {
    updateScrollRightContainer(event, this._linesContainer);
  }

  public scrollLeft(event: any): void {
    updateScrollLeftContainer(event, this._linesContainer);
  }
}
