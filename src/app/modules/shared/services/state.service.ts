import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  private backState: boolean = false;
  private scrollMainTabState: boolean = false;

  private toolbarBackState: BehaviorSubject<boolean>;
  private mainTabState: BehaviorSubject<boolean>;

  constructor() {
    this.toolbarBackState = new BehaviorSubject<boolean>(false);
    this.mainTabState = new BehaviorSubject<boolean>(false);
  }

  public get backStateModel(): any {
    return this.backState;
  }

  public set backStateModel(data: any) {
    this.backState = data;
    this.toolbarBackState.next(this.backState);
  }

  public stateModelListener(): Observable<any> {
    return this.toolbarBackState.asObservable();
  }

  public tabStateModelListener(): Observable<any> {
    return this.mainTabState.asObservable();
  }

  public changeBackState(state: boolean): void {
    this.toolbarBackState.next(state);
  }

  public changeTabState(state: boolean): void {
    this.mainTabState.next(state);
  }
}
