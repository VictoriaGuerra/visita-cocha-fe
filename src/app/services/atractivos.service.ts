import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Atractivo {
  id: string;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  imagen: string;
  categoria: string;
}

@Injectable({
  providedIn: 'root'
})
export class AtractivosService {
private apiUrl = '/atractivos'; // ← RUTA RELATIVA, sin "http://localhost:3000"
  constructor(private http: HttpClient) { }

  getAtractivos(): Observable<Atractivo[]> {
    return this.http.get<Atractivo[]>(this.apiUrl);
  }

  getAtractivoById(id: string): Observable<Atractivo> {
    return this.http.get<Atractivo>(`${this.apiUrl}/${id}`);
  }
}
