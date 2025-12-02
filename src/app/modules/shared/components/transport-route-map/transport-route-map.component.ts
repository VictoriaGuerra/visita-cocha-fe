import { AfterViewInit, Component, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';

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
  @Input() route?: RouteFile | null;

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
      const r: RouteFile | null = changes['route'].currentValue;
      if (r) this.loadAndDraw(r);
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
        },
        error: (err) => {
          this.error = err?.message || 'Error cargando geojson';
          this.loading = false;
        }
      });
    } else if (route.tipoArchivo === 'kml') {
      // KML: fetch as text, parse to XML and convert to GeoJSON using toGeoJSON
      this.http.get(url, { responseType: 'text' }).subscribe({
        next: (text: string) => {
          try {
            const parser = new DOMParser();
            const kmlDoc = parser.parseFromString(text, 'text/xml');
            // toGeoJSON should be available globally (install `togeojson` and import in polyfills or index)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const tg = (window as any).toGeoJSON || (window as any).togeojson;
            if (!tg || typeof tg.kml !== 'function') {
              this.error = 'La librería toGeoJSON no está disponible. Instala `togeojson`.';
              this.loading = false;
              return;
            }
            const geo = tg.kml(kmlDoc);
            this.drawGeoJSON(geo);
          } catch (e: any) {
            this.error = e?.message || 'Error parseando KML';
          } finally {
            this.loading = false;
          }
        },
        error: (err) => {
          this.error = err?.message || 'Error cargando KML';
          this.loading = false;
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
      const layer = L.geoJSON(geo, {
        style: () => ({ color: '#0b5', weight: 4 }),
        pointToLayer: (feature, latlng) => L.circleMarker(latlng, { radius: 5 })
      });
      layer.addTo(this.map);
      this.routeLayer = layer;

      const bounds = layer.getBounds && layer.getBounds();
      if (bounds && bounds.isValid()) {
        this.map.fitBounds(bounds, { padding: [20, 20] });
      }
    } catch (e: any) {
      this.error = e?.message || 'Error dibujando GeoJSON';
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = undefined;
    }
  }
}
