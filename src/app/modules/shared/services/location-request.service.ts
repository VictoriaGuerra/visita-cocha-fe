import {AngularFirestore} from '@angular/fire/compat/firestore';

import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';

import {FirebaseRepositoryService} from '../../../../framework/repository/firebase.repository-service';

@Injectable({
  providedIn: 'root'
})
export class LocationRequestRepositoryService extends FirebaseRepositoryService<any> {
  private _item: any;
  private _list$: any;

  constructor(private _angularFireStore: AngularFirestore) {
    super(_angularFireStore);

    this._list$ = new BehaviorSubject<any>(this._item);
  }

  public getCollectionName(): string {
    return 'location-request';
  }
}
