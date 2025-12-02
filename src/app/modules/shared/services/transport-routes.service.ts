import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

export interface TransportRoute {
  id: string;
  name: string;
  [key: string]: any;
}

@Injectable()
export class TransportRoutesService {
  /**
   * Base URL por defecto para la API de rutas. Se puede sobreescribir en los métodos.
   */
  private readonly defaultUrl = '/api/transport-routes';

  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  /** Observable público para estados de carga */
  loading$ = this.loadingSubject.asObservable();

  /** Observable público para mensajes de error */
  error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todas las rutas.
   * @param apiUrl URL de la API que devuelve un array de rutas (opcional)
   */
  getAllRoutes(apiUrl: string = this.defaultUrl): Observable<TransportRoute[]> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);
    return this.http.get<TransportRoute[]>(apiUrl).pipe(
      catchError((err) => {
        const msg = err?.message || 'Error al obtener rutas';
        this.errorSubject.next(msg);
        return of([] as TransportRoute[]);
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  /**
   * Obtiene una ruta por su id.
   * Construye la URL como `${apiUrl}/{id}` por defecto.
   * @param id Identificador de la ruta
   * @param apiUrl URL base de la colección de rutas (opcional)
   */
  getRouteById(id: string, apiUrl: string = this.defaultUrl): Observable<TransportRoute> {
    const url = `${apiUrl.replace(/\/$/, '')}/${encodeURIComponent(id)}`;
    this.loadingSubject.next(true);
    this.errorSubject.next(null);
    return this.http.get<TransportRoute>(url).pipe(
      catchError((err) => {
        const msg = err?.message || `Error al obtener ruta ${id}`;
        this.errorSubject.next(msg);
        // rethrow as observable error to allow callers to react
        throw err;
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  /**
   * Compatibilidad hacia atrás: alias de `getAllRoutes`.
   */
  getRoutes(url: string = this.defaultUrl): Observable<TransportRoute[]> {
    return this.getAllRoutes(url);
  }

  clearError() {
    this.errorSubject.next(null);
  }
}
