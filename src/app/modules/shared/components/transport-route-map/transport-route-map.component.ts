import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
  ElementRef
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import { kml as toGeoJSONkml } from 'togeojson';

export interface RouteFile {
  archivoUrl: string;
  tipoArchivo: 'kml' | 'geojson';
  [key: string]: any;
}

@Component({
  selector: 'app-transport-route-map',
  templateUrl: './transport-route-map.component.html',
  styleUrls: ['./transport-route-map.component.scss']
})
export class TransportRouteMapComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef<HTMLDivElement>;
  @Input() route: RouteFile | null = null;

  private map?: L.Map;
  private routeLayer?: L.Layer;
  loading = false;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    this.initMap();
    if (this.route) {
      this.loadAndDraw(this.route);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['route'] && !changes['route'].isFirstChange()) {
      const r = changes['route'].currentValue as RouteFile | null;
      if (r) {
        this.loadAndDraw(r);
      }
    }
  }

  private initMap(): void {
    if (this.map) return;

    this.map = L.map(this.mapContainer.nativeElement, {
      center: [0, 0],
      zoom: 2
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
  }

  private clearRouteLayer(): void {
    if (this.routeLayer && this.map) {
      this.map.removeLayer(this.routeLayer);
      this.routeLayer = undefined;
    }
  }

  private loadAndDraw(route: RouteFile): void {
    this.loading = true;
    this.error = null;
    this.clearRouteLayer();

    const url = route.archivoUrl;
    if (!url) {
      this.error = 'Ruta sin URL de archivo';
      this.loading = false;
      return;
    }

    if (route.tipoArchivo === 'geojson') {
      this.http.get(url).subscribe({
        next: (data: any) => {
          this.drawGeoJSON(data);
          this.loading = false;
          console.debug('TransportRouteMapComponent: loaded geojson route=', route, data);
        },
        error: (err) => {
          this.error = err?.message || 'Error cargando geojson';
          this.loading = false;
          console.error('TransportRouteMapComponent: error loading geojson', err);
        }
      });
    } else if (route.tipoArchivo === 'kml') {
      this.http.get(url, { responseType: 'text' }).subscribe({
        next: (text: string) => {
          console.debug(
            'TransportRouteMapComponent: received KML text length=',
            text?.length
          );
          try {
            const parser = new DOMParser();
            const kmlDoc = parser.parseFromString(text, 'text/xml');

            try {
              const geo = (toGeoJSONkml as unknown as (doc: Document) => any)(kmlDoc);
              console.debug(
                'TransportRouteMapComponent: kml->geo result keys=',
                geo && Object.keys(geo)
              );
              this.drawGeoJSON(geo);
            } catch (err) {
              this.error =
                (err as any)?.message || 'Error convirtiendo KML con toGeoJSON';
              console.error('TransportRouteMapComponent: error converting KML', err);
            }
          } catch (e: any) {
            this.error = e?.message || 'Error parseando KML';
            console.error('TransportRouteMapComponent: error parsing KML', e);
          } finally {
            this.loading = false;
          }
        },
        error: (err) => {
          this.error = err?.message || 'Error cargando KML';
          this.loading = false;
          console.error('TransportRouteMapComponent: error loading KML', err);
        }
      });
    } else {
      this.error = 'Tipo de archivo no soportado';
      this.loading = false;
    }
  }

  private drawGeoJSON(geo: any): void {
    if (!this.map) return;

    this.clearRouteLayer();

    try {
      console.debug('TransportRouteMapComponent: received geo object', geo);

      const layer = L.geoJSON(geo, {
        style: () => ({ color: '#0b5', weight: 4 }),
        pointToLayer: (feature, latlng) => L.circleMarker(latlng, { radius: 5 })
      });

      const layers = (layer as any).getLayers ? (layer as any).getLayers() : [];
      console.debug(
        'TransportRouteMapComponent: created geoJSON layer, child layers count=',
        layers.length
      );

      layer.addTo(this.map);
      this.routeLayer = layer;

      try {
        this.map.invalidateSize();
      } catch {
        /* ignore */
      }

      const bounds = (layer as any).getBounds && (layer as any).getBounds();
      console.debug('TransportRouteMapComponent: computed bounds =', bounds);

      if (bounds && bounds.isValid()) {
        this.map.fitBounds(bounds, { padding: [20, 20] });
      } else {
        // fallback: centrar en primer punto si no hay bounds válidos
        if (layers && layers.length) {
          const firstLayer = layers[0];
          if ((firstLayer as any).getLatLng) {
            const latlng = (firstLayer as any).getLatLng();
            if (latlng) {
              this.map.setView(latlng as any, 13);
            }
          }
        }
      }
    } catch (e: any) {
      this.error = e?.message || 'Error dibujando GeoJSON';
      console.error('TransportRouteMapComponent: error drawing geojson', e);
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = undefined;
    }
  }
}
