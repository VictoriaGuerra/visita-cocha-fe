import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class TransportService {
  constructor(private http: HttpClient) { }

  /**
   * Load a GeoJSON route stored under assets/GeoJSON/<fileName>.json
   */
  public loadRouteFile(fileName: string) {
    const path = `assets/GeoJSON/${fileName}`;
    return this.http.get(path);
  }
}
