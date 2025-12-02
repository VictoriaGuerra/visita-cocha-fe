import { Component, OnDestroy } from '@angular/core';
import { TransportRoute } from '../../services/transport-routes.service';
import { TransportRoutesService } from '../../services/transport-routes.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-transport-routes-page',
  templateUrl: './transport-routes-page.component.html',
  styleUrls: ['./transport-routes-page.component.scss']
})
export class TransportRoutesPageComponent {
  selectedRoute: TransportRoute | null = null;
  loadingRouteDetails = false;
  error: string | null = null;

  private subs: Subscription[] = [];

  constructor(private routesService: TransportRoutesService) {
    // reflect service loading/error for the list on the page
    this.subs.push(this.routesService.loading$.subscribe(l => {
      // when list is loading we don't override detail-loading
      if (!this.loadingRouteDetails) this.loadingRouteDetails = l;
    }));
    this.subs.push(this.routesService.error$.subscribe(e => {
      if (e) this.error = e;
    }));
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  onRouteSelected(routeOrId: any) {
    // The list component emits the route object when available, but it could emit an id.
    this.error = null;
    if (!routeOrId) {
      this.selectedRoute = null;
      return;
    }

    // If it's an object and has archivoUrl/tipoArchivo, use it directly
    if (typeof routeOrId === 'object' && (routeOrId.archivoUrl || routeOrId.tipoArchivo)) {
      this.selectedRoute = routeOrId as TransportRoute;
      return;
    }

    // Otherwise assume it's an id and fetch full details
    const id = typeof routeOrId === 'string' ? routeOrId : routeOrId.id;
    if (!id) {
      this.error = 'ID de ruta inválido';
      return;
    }

    this.loadingRouteDetails = true;
    this.routesService.getRouteById(id).subscribe({
      next: (r) => {
        this.selectedRoute = r;
        this.loadingRouteDetails = false;
      },
      error: (err) => {
        this.error = err?.message || 'Error cargando detalle de ruta';
        this.loadingRouteDetails = false;
      }
    });
  }
}
