import {from, map, Observable} from 'rxjs';

import { HttpClient } from '@angular/common/http';

export abstract class MongoRepositoryService<ENTITY> {
  private _collectionName: string;

  constructor(private _http: HttpClient) {
    this._collectionName = this.getCollectionName();
  }

  // public create(entity: ENTITY) {
    // return from(this._collectionRef.add(entity))
    //   .pipe(
    //     map((docRef: DocumentReference<ENTITY>) => docRef.id)
    //   );
  // }

  // public delete(id: string) {
  // }

  // public getById(id: string) {
  // }

  public list(): Observable<ENTITY []> {
    return this._http.get<any>('http://localhost:3000/attractions');
  }

  // public update(entity: Partial<ENTITY>, id: string) {
  // }

  public abstract getCollectionName(): string;

}
