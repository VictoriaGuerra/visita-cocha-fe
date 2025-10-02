import {AngularFirestore} from '@angular/fire/compat/firestore';

import {Injectable} from '@angular/core';

import {FirebaseRepositoryService} from '../../../../framework/repository/firebase.repository-service';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementRepositoryService extends FirebaseRepositoryService<any> {
  constructor(private _angularFireStore: AngularFirestore) {
    super(_angularFireStore);
  }

  public getCollectionName(): string {
    return 'announcements';
  }
}
