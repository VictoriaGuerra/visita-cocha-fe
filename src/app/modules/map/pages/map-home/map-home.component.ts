import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Subject, takeUntil} from 'rxjs';
import {AttractionRepositoryService} from 'src/app/modules/shared/services/attraction.service';
import {RestaurantRepositoryService} from 'src/app/modules/shared/services/restaurant.service';
import {StateService} from 'src/app/modules/shared/services/state.service';
import { TransportService } from 'src/app/modules/shared/services/transport.service';
import { WeatherService } from 'src/app/modules/shared/services/weather.service';
import * as L from 'leaflet';
import {ModalController} from '@ionic/angular';
import {Consulates} from '../../constants/consulates';
import {InfoMapComponent} from '../../components/info-map/info-map.component';
import {Universities} from '../../constants/universities';
import {ConfigList} from 'src/framework/repository/api/config-list.model';
import {TrashContainers} from '../../constants/trash-containers';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { QrViewerComponent } from 'src/app/modules/shared/components/qr-viewer/qr-viewer.component';
import { Pluviometers } from '../../constants/pluviometers';

@Component({
  selector: 'map-home-page',
  templateUrl: './map-home.component.html'
})
export class MapHomeComponent implements OnInit, OnDestroy {

  public leafletMap: L.Map;
  public showMap: boolean;

  public module: string;
  public items: any[];
  public attractions: any[] | null;
  public restaurants: any[] | null;

  public consulates = Consulates;
  public universities = Universities;
  public trashContainers = TrashContainers;
  public pluviometers = Pluviometers;
  
  public position: any;
  public isLoading!: any;
  public weatherData: any = null;
  public weatherUnit: 'metric' | 'imperial' = 'metric';
  public weatherCached: boolean = false;

  public ref: DynamicDialogRef;
  
  public configList: ConfigList = {
    queryList: [
      {
        field: 'available',
        operation: '==',
        value: true
      }
    ]
  };

  public locationIcon = new L.Icon({
    iconUrl: 'assets/images/map/pins/pin.svg',
    iconSize: [20, 50]
  });

  public consulateIcon = new L.Icon({
    iconUrl: 'assets/images/map/pins/flag.svg',
    iconSize: [20, 50]
  });

  public universityIcon = new L.Icon({
    iconUrl: 'assets/images/map/pins/university.svg',
    iconSize: [20, 25]
  });

  public userLocationIcon = new L.Icon({
    iconUrl: 'assets/images/map/pins/location.webp',
    iconSize: [70, 70]
  });

  public trashIcon = new L.Icon({
    iconUrl: 'assets/images/map/pins/trashContainer.svg',
    iconSize: [30, 60]
  });

  public sensorIcon = new L.Icon({
    iconUrl: 'assets/images/map/pins/sensorIcon.svg',
    iconSize: [30, 50]
  });

  private _unsubscribe: Subject<void>;

  constructor(private _attractionRepositoryService: AttractionRepositoryService,
              private _restaurantRepositoryService: RestaurantRepositoryService,
              private _modalController: ModalController,
              private _dialogService: DialogService,
              private _stateService: StateService,
              private _cdr: ChangeDetectorRef,
              public router: Router,
              private _transportService: TransportService,
              private _weatherService: WeatherService) {
    this._unsubscribe = new Subject<void>();
    const storedUnit = localStorage.getItem('weatherUnit');
    if (storedUnit === 'imperial') { this.weatherUnit = 'imperial'; }
    // subscribe to global weather unit changes
    this._stateService.weatherUnitListener().pipe(takeUntil(this._unsubscribe)).subscribe((u) => {
      if (u && this.weatherUnit !== u) {
        this.weatherUnit = u;
        // refresh weather automatically when unit changes
        if (this.position) {
          const lat = Number(this.position.coords.latitude);
          const lon = Number(this.position.coords.longitude);
          this._weatherService.getByCoords(lat, lon, this.weatherUnit, true).subscribe((wd: any) => {
            this.weatherData = wd;
            this.weatherCached = false;
            this._cdr.markForCheck();
          }, (err) => { console.warn('Weather refresh failed on unit change', err); });
        }
      }
    });

    // subscribe to global latest weather so the card updates when toolbar triggers unit change
    this._stateService.weatherLatestListener().pipe(takeUntil(this._unsubscribe)).subscribe((w: any) => {
      if (w && w.main && typeof w.main.temp === 'number') {
        this.weatherData = w;
        // presume this data is from cache/persisted unless a fresh fetch sets weatherCached=false
        this.weatherCached = true;
        this._cdr.markForCheck();
      }
    });
  }

  ngOnInit(): void {
    this.showMap = false;
    this.position = null;
    this.attractions = null;
    this.restaurants = null;
    this.module = 'attractions';
  }

  public toggleWeatherUnit(): void {
    this.weatherUnit = this.weatherUnit === 'metric' ? 'imperial' : 'metric';
    localStorage.setItem('weatherUnit', this.weatherUnit);
    // refetch weather for current position
    if (this.position) {
      const lat = Number(this.position.coords.latitude);
      const lon = Number(this.position.coords.longitude);
      this._weatherService.getByCoords(lat, lon, this.weatherUnit, true).subscribe((wd: any) => {
        this.weatherData = wd;
        try { this._stateService.setWeatherLatest(wd); } catch (e) {}
        this.weatherCached = false;
        this._cdr.markForCheck();
      }, (err) => { console.warn('Weather refresh failed', err); });
    }
  }

  public refreshWeather(): void {
    if (this.position) {
      const lat = Number(this.position.coords.latitude);
      const lon = Number(this.position.coords.longitude);
      this._weatherService.getByCoords(lat, lon, this.weatherUnit, true).subscribe((wd: any) => {
        this.weatherData = wd;
        try { this._stateService.setWeatherLatest(wd); } catch (e) {}
        this.weatherCached = false;
        this._cdr.markForCheck();
      }, (err) => {
        console.warn('Weather refresh failed', err);
      });
    }
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  ionViewWillEnter() {
    this._stateService.changeBackState(true);
    this._initMap();
    this.changeTab();
  }

  ionViewDidLeave() {
    this._stateService.changeBackState(false);
  }

  // Get map info
  public async changeTab(): Promise<any> {
    let service: any;
    let list: any;
    this.isLoading = true;

    switch (this.module) {
      case 'restaurants':
        service = this._restaurantRepositoryService;
        list = this.restaurants;
        break;

      default:
        service = this._attractionRepositoryService;
        list = this.attractions;
        break;
    }

    if (!list) {
      await this._getItems(service, list);
    } else {
      this.items = list;
    }
  }

  public async openInfoModal() {
    let infoList = this.getInfoList();
    
    const actionSheet = await this._modalController.create({
      component: InfoMapComponent,
      componentProps: {
        data: infoList
      },
      initialBreakpoint: .5,
      breakpoints: [0, .5]
    });

    actionSheet.present();
  }

  public getInfoList(): any {
    return {
      infoList: [
        {
          name: 'Locación',
          icon: this.locationIcon
        },
        {
          name: 'Consulado',
          icon: this.consulateIcon
        },
        {
          name: 'Universidad',
          icon: this.universityIcon
        },
        {
          name: 'Basurero soterrado',
          icon: this.trashIcon
        },
        // {
        //   name: 'Sensores',
        //   icon: this.sensorIcon
        // }
      ],
      text: 'Selecciona un punto en el mapa para ver más información y como llegar al lugar.'
    }
  }

  private async _getItems(service: any, list: any): Promise<any> {
    try {
      await service.getByQuery(this.configList)
      .pipe(
          takeUntil(this._unsubscribe)
      )
      .subscribe(async(items: any) => {
        list = items;
        this.items = list;
        this._markModulePins(items, 'module', true, this.locationIcon);
        this._markModulePins(this.consulates, 'pin', false, this.consulateIcon);
        this._markModulePins(this.universities, 'pin', false, this.universityIcon);
        this._markModulePins(this.trashContainers, 'pin', false, this.trashIcon);
        // this._markPluviometerPins(this.pluviometers, false, this.sensorIcon);
        this.isLoading = false;

        this._cdr.markForCheck();
      });
    } catch (error) {
      alert('Error cargando locaciones');
      this.isLoading = false;
    }
  }

  // Mark pins map
  private _markModulePins(items: any, type: string, reinitMap: boolean, icon: any): void {
    if (reinitMap) {
      this._prepareMap();
    }

    for (let i = 0; i < items.length; i++) {
      if (Number(items[i]?.location?.coords?.lat) && Number(items[i]?.location?.coords?.lng)) {
        const popupContent = this._generatePopupContent(items[i], type);

        L?.marker([Number(items[i]?.location?.coords?.lat), Number(items[i]?.location?.coords?.lng)], {icon: icon })
        .addTo(this.leafletMap)
        .bindPopup(popupContent);
      }
    };

    if (this.position) {
      this._addUserLocation();
    };

    this.showMap = true;
  }

  private _markPluviometerPins(items: any, reinitMap: boolean, icon: any): void {
    if (reinitMap) {
      this._prepareMap();
    }

    for (let i = 0; i < items.length; i++) {
      if (Number(items[i]?.location?.coords?.lat) && Number(items[i]?.location?.coords?.lng)) {
        const popupContent = `
          <iframe class="w-24rem md:w-25rem h-16rem md:h-17rem border-none"
                  src="${ items[i].link }">
          </iframe>
      `;

        L?.marker([Number(items[i]?.location?.coords?.lat), Number(items[i]?.location?.coords?.lng)], {icon: icon })
        .addTo(this.leafletMap)
        .bindPopup(popupContent);
      }
    };

    if (this.position) {
      this._addUserLocation();
    };

    this.showMap = true;
  }

  //Popup Content generator
  private _generatePopupContent(item: any, type: string) {
    let url = `https://www.google.com/maps/dir/${Number(this.position?.coords?.latitude)},${Number(this.position?.coords?.longitude)}/${item?.location?.coords.lat},${item?.location?.coords.lng}`;
    let button = '';
    let image = '';
    let linkButton = '';

    if (item.photo !== '') {
      image = `
      <div class="max-w-5rem h-auto flex align-items-center">
        <img src="${item?.photo}"
             alt="${item?.name} photo"
             class="w-full h-auto">
      </div>`
    }

    if (this.position && (localStorage.getItem('publicMode') !== 'true')) {
      button = `
      <ion-button class="mt-1"
                  expand="block"
                  color="secondary"
                  size="small"
                  target="_blank""
                  href="${url}">
        <ion-icon slot="start" name="map-outline" class="mr-1"></ion-icon>
        Como llegar
      </ion-button>
      `;
    };

    if (item.link) {
      linkButton = `
        <ion-button class="mt-1"
                    color="medium"
                    expand="block"
                    fill="clear"
                    size="small"
                    target="_blank"
                    href="${item?.link}">
          Ver detalles
        </ion-button>
      `
    }

    const popupContent = `
        <div style="min-width: 14rem">
          <div class="mx-auto flex gap-3">
            ${image}
            <h4 class="w-fit text-sm">${item?.name}</h4>
          </div>

          ${linkButton}

          ${button}
    `;

    const modulePopupContent = `
      <div>
        <img class="border-round-xl"
             src="${item?.coverUrl}"
             alt="${item?.name} photo">
        <h4 class="mt-1 mb-0">${item?.name}</h4>

        ${button}

        <ion-button class="mt-1"
                    color="secondary"
                    expand="block"
                    size="small"
                    href="/detail/${this.module}/${item?.id}">
          Ver detalles
        </ion-button>
      </div>
    `;

    switch (type) {
      case 'module':
        return modulePopupContent;

      default:
        return popupContent;
    }
  }

  // Init map and user Location
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
  }

  private _createMap() {
    return new L.Map('map', {
      center: [-17.39349, -66.15708],
      zoom: 14
    });
  }

  private _addUserLocation(): any {
    const popupContent = `
      <div>
        <h4 class="mt-1 mb-0">Estas aquí</h4>
      </div>
    `;

    L?.marker([Number(this.position.coords?.latitude), Number(this.position.coords?.longitude)], {icon: this.userLocationIcon })
    .addTo(this.leafletMap)
    .bindPopup(popupContent);

    this._cdr.markForCheck();
  }

  private _prepareMap() {
    let count = 0;

    this.leafletMap?.eachLayer((layer: L.Layer) => {
      if (count > 0) {
        layer.remove();
      } else {
        count++;
      }
    });
  }

  public async getLocation(): Promise<any> {
    // Improve when is Not grantes re confirm location access or alert
    try {
      if ('geolocation' in navigator) {
        this.position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        if (this.position && this.leafletMap) {
          this._addUserLocation();
          this.setMapPosition();
          // fetch weather for current user location (best-effort)
          try {
            const lat = Number(this.position.coords.latitude);
            const lon = Number(this.position.coords.longitude);
            this._weatherService.getByCoords(lat, lon, this.weatherUnit).subscribe((wd: any) => {
              this.weatherData = wd;
              // publish latest weather to global state
              try { this._stateService.setWeatherLatest(wd); } catch (e) {}
              this.weatherCached = false;
              this._cdr.markForCheck();
            }, (err) => {
              console.warn('Weather fetch failed', err);
              // try to get cached value
              try {
                this._weatherService.getByCoords(lat, lon, this.weatherUnit).subscribe((cached: any) => {
                  this.weatherData = cached;
                  try { this._stateService.setWeatherLatest(cached); } catch (e) {}
                  this.weatherCached = true;
                  this._cdr.markForCheck();
                });
              } catch (e) {}
            });
          } catch (e) {
            console.warn('Could not fetch weather', e);
          }
        }
      }
    } catch (error) {
      console.log(error);
      this.position = null;
    }
  }

  public setMapPosition(): any {
    this.leafletMap?.setView([Number(this.position.coords?.latitude), Number(this.position.coords?.longitude)],15);
  }

  private _openLink(url: string): void {
    if ((localStorage.getItem('publicMode') === 'true')) {
      this._openQR(url);
    } else {
      window.open(url);
    }
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

  /** Load a GeoJSON route file from assets and add it to the map */
  public loadRoute(fileName: string): void {
    if (!fileName) { return; }

    this._transportService.loadRouteFile(fileName)
      .subscribe((geojson: any) => {
        try {
          const layer = (L as any).geoJSON ? L.geoJSON(geojson) : (L as any).geoJson(geojson);
          layer.addTo(this.leafletMap);
          // fit map to route bounds if possible
          if (layer.getBounds && typeof layer.getBounds === 'function') {
            const bounds = layer.getBounds();
            if (bounds.isValid && bounds.isValid()) {
              this.leafletMap.fitBounds(bounds);
            }
          }
        } catch (err) {
          console.warn('Failed to add geojson to map', err);
        }
      }, (err) => {
        console.warn('Failed loading route file', err);
      });
  }
}
