import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FirebaseRepositoryService } from 'src/framework/repository/firebase.repository-service';

@Injectable({ providedIn: 'root' })
export class SearchService {
  constructor(private http: HttpClient, private firebaseRepo: FirebaseRepositoryService<any>) { }

  /**
   * Simple wrapper for FirebaseRepositoryService queries using the project's ConfigList convention.
   */
  public searchByConfig(config: any) {
    return this.firebaseRepo.getByQuery(config);
  }

  // Add placeholder for advanced geospatial search (to be implemented with Firestore geohashes or external index)
  public geoSearch(bounds: any, filters: any) {
    // TODO: implement server-side geospatial index
    return Promise.resolve([]);
  }
}
