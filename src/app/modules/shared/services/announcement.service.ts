import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {

  private apiUrl = 'https://cochabamba.bo/api/noticias/ultimas';

  constructor(private http: HttpClient) { }

  getLastNews(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}

