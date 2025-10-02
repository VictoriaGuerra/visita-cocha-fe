import {Injectable} from '@angular/core';

import {GoogleAuthProvider} from '@angular/fire/auth';
import {AngularFireAuth} from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {

  private _provider = new GoogleAuthProvider();

  constructor(private _angularFireAuth: AngularFireAuth) {
  }

  public async login(): Promise<any> {
      return this._angularFireAuth.signInWithPopup(this._provider);
  }
}
