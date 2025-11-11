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
  private weatherUnitState: BehaviorSubject<'metric' | 'imperial'>;
  private weatherLatestState: BehaviorSubject<any>;

  constructor() {
    this.toolbarBackState = new BehaviorSubject<boolean>(false);
    this.mainTabState = new BehaviorSubject<boolean>(false);
    const unit = (localStorage.getItem('weatherUnit') as 'metric' | 'imperial') || 'metric';
    this.weatherUnitState = new BehaviorSubject<'metric' | 'imperial'>(unit);
    // try to hydrate latest weather from localStorage
    let latest: any = null;
    try {
      const raw = localStorage.getItem('weather_latest');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.data) {
          // hydrate stored data and attach unit metadata so consumers know the source unit
          latest = parsed.data;
          try { latest._unit = parsed.unit || unit; } catch (e) {}
          // if the persisted unit differs from current unit, convert temp roughly so UI shows current unit
          if (parsed.unit && parsed.unit !== unit && latest.main && typeof latest.main.temp === 'number') {
            try {
              if (unit === 'imperial') {
                latest.main.temp = Math.round((latest.main.temp * 9 / 5) + 32);
              } else {
                latest.main.temp = Math.round((latest.main.temp - 32) * 5 / 9);
              }
              // mark that it's been converted for display
              latest._converted = true;
            } catch (e) {}
          }
        }
      }
    } catch (e) {
      latest = null;
    }
    this.weatherLatestState = new BehaviorSubject<any>(latest);
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

  public weatherUnitListener(): Observable<'metric' | 'imperial'> {
    return this.weatherUnitState.asObservable();
  }

  public changeWeatherUnit(unit: 'metric' | 'imperial'): void {
    try {
      const prev = this.weatherUnitState.getValue();
      // store the chosen unit
      try { localStorage.setItem('weatherUnit', unit); } catch (e) {}
      // update unit state
      this.weatherUnitState.next(unit);

      // If we already have a latest-weather object, convert its temperature so UI updates immediately.
      // Prefer using the metadata _unit if present to avoid double-converting values.
      const latest = this.weatherLatestState.getValue();
      if (latest && latest.main && typeof latest.main.temp === 'number') {
        const sourceUnit: 'metric' | 'imperial' = (latest._unit as any) || prev || 'metric';
        if (sourceUnit !== unit) {
          const converted = JSON.parse(JSON.stringify(latest));
          try {
            if (unit === 'imperial') {
              // convert C -> F
              converted.main.temp = Math.round((converted.main.temp * 9 / 5) + 32);
              // convert wind m/s -> mph
              if (converted.wind && typeof converted.wind.speed === 'number') {
                converted.wind.speed = Math.round((converted.wind.speed * 2.2369362920544) * 100) / 100;
                converted.wind.unit = 'mph';
              }
            } else {
              // convert F -> C
              converted.main.temp = Math.round((converted.main.temp - 32) * 5 / 9);
              // convert wind mph -> m/s
              if (converted.wind && typeof converted.wind.speed === 'number') {
                converted.wind.speed = Math.round((converted.wind.speed / 2.2369362920544) * 100) / 100;
                converted.wind.unit = 'm/s';
              }
            }
            converted._unit = unit;
          } catch (e) {
            // conversion failed, keep original
          }
          // Preserve mock flag if present
          try { converted._isMock = !!latest._isMock; } catch (e) {}
          this.weatherLatestState.next(converted);
        } else {
          // Units already match; just ensure the metadata unit is current
          try { latest._unit = unit; } catch (e) {}
          // also ensure wind.unit matches expected
          try {
            if (latest.wind) {
              latest.wind.unit = latest.wind.unit || (unit === 'metric' ? 'm/s' : 'mph');
            }
          } catch (e) {}
          this.weatherLatestState.next(latest);
        }
      }
    } catch (e) {
      // best-effort: still emit the unit change
      try { localStorage.setItem('weatherUnit', unit); } catch (err) {}
      this.weatherUnitState.next(unit);
    }
  }

  public weatherLatestListener(): Observable<any> {
    return this.weatherLatestState.asObservable();
  }

  public setWeatherLatest(data: any): void {
    try {
      // persist last weather with unit to localStorage
      const unit = this.weatherUnitState.getValue() || 'metric';
      // Attach metadata to the object so consumers know the source unit
      try { data._unit = unit; } catch (e) {}
      const payload = { ts: Date.now(), unit, data };
      try { localStorage.setItem('weather_latest', JSON.stringify(payload)); } catch (e) {}
    } catch (e) {}
    this.weatherLatestState.next(data);
  }

  public changeBackState(state: boolean): void {
    this.toolbarBackState.next(state);
  }

  public changeTabState(state: boolean): void {
    this.mainTabState.next(state);
  }
}
