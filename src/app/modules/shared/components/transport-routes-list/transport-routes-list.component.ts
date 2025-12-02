import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { TransportRoute, TransportRoutesService } from '../../services/transport-routes.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-transport-routes-list',
  templateUrl: './transport-routes-list.component.html',
  styleUrls: ['./transport-routes-list.component.scss']
})
export class TransportRoutesListComponent implements OnInit {
  @Input() apiUrl: string = '/api/transport-routes';
  @Input() mode: 'dropdown' | 'list' = 'dropdown';
  @Input() placeholder: string = 'Selecciona una ruta';

  @Output() routeSelected = new EventEmitter<TransportRoute>();

  routes: TransportRoute[] = [];
  loading = false;
  error: string | null = null;
  private subs: Subscription[] = [];
  selectedId: string | null = null;

  constructor(private routesService: TransportRoutesService) {}

  ngOnInit(): void {
    // Subscribe to service-wide loading/error states
    this.subs.push(
      this.routesService.loading$.subscribe(l => this.loading = l)
    );
    this.subs.push(
      this.routesService.error$.subscribe(e => this.error = e)
    );

    this.loadRoutes();
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  loadRoutes(): void {
    this.loading = true;
    this.error = null;
    this.routesService.getAllRoutes(this.apiUrl).subscribe({
      next: (r) => {
        this.routes = r || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.message || 'Error al obtener rutas';
        this.loading = false;
      }
    });
  }

  onSelect(id: string | null): void {
    this.selectedId = id;
    const found = this.routes.find(rt => rt.id === id) || null;
    if (found) this.routeSelected.emit(found);
    else this.routeSelected.emit(null as any);
  }
}
