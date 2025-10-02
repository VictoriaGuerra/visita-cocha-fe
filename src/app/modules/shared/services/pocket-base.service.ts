import PocketBase from 'pocketbase';

import {Injectable} from '@angular/core';
import {from} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PocketBaseService {
  private _pb: PocketBase;
  private _locationCollectionName: string = 'location';

  constructor() {
    this._pb = new PocketBase('https://boring-carpenter.pockethost.io');
  }

  public getList(page: number, size: number, query = {}) {
    return from(this._pb.collection(this._locationCollectionName).getList(page, size, query));
  }

  public getFullList(query = {}) {
    return from(this._pb.collection(this._locationCollectionName).getFullList(query));
  }

  public getFirstItem(filter: string, query = {}) {
    return from(this._pb.collection(this._locationCollectionName).getFirstListItem(filter, query));
  }

  public getById(id: string, expand?: string) {
    return from(this._pb.collection(this._locationCollectionName).getOne(id, { expand }));
  }
}
