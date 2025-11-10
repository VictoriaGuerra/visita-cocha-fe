import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Location } from '@angular/common';
import { StateService } from '../../services/state.service';
import { PushNotificationService } from '../../services/push-notification.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-main-toolbar',
  templateUrl: './main-toolbar.component.html',
  styleUrls: ['./main-toolbar.component.scss'],
})
export class MainToolbarComponent implements OnInit {

  public backState: boolean;

  private _unsubscribe: Subject<void>;

  constructor(private menu: MenuController,
              public router: Router,
              private _cdr: ChangeDetectorRef,
              public location: Location,
              private _stateService: StateService,
              private _pushService: PushNotificationService,
              private _toast: ToastController) {
    this._unsubscribe = new Subject<void>();
    this.backState = false;
  }

              public notifStatus: string = 'unknown';
              public weatherUnit: 'metric' | 'imperial' = 'metric';
              public toolbarWeatherTemp: number | null = null;
              public toolbarWeatherIsMock: boolean = false;

  ngOnInit() {
    this._stateDataListener();
    // subscribe to global weather unit
    this._stateService.weatherUnitListener().pipe(takeUntil(this._unsubscribe)).subscribe((u) => {
      this.weatherUnit = u;
      this._cdr.markForCheck();
    });
    // subscribe to latest weather for toolbar display
    this._stateService.weatherLatestListener().pipe(takeUntil(this._unsubscribe)).subscribe((w: any) => {
      if (w && w.main && typeof w.main.temp === 'number') {
        this.toolbarWeatherTemp = Math.round(w.main.temp);
        this.toolbarWeatherIsMock = !!w._isMock;
      } else {
        this.toolbarWeatherTemp = null;
        this.toolbarWeatherIsMock = false;
      }
      this._cdr.markForCheck();
    });
    // initialize notification status
    try {
      this.notifStatus = ('Notification' in window) ? Notification.permission : 'unsupported';
    } catch (e) {
      this.notifStatus = 'unsupported';
    }
  }

  public toggleWeatherUnitGlobal() {
    const newUnit = this.weatherUnit === 'metric' ? 'imperial' : 'metric';
    this._stateService.changeWeatherUnit(newUnit);
  }

  openSideBar(id: string) {
    this.menu.open(id);
    // after opening the side menu, set focus to it for keyboard users
    setTimeout(() => {
      const menuEl: any = document.querySelector('ion-menu#side-menu');
      if (menuEl) { menuEl.focus(); }
    }, 300);
  }

  public async toggleNotifications() {
    try {
      // try to register service worker first and show scope for debugging
      try {
        const reg = await this._pushService.registerServiceWorker();
        if (reg && reg.scope) {
          const t = await this._toast.create({ message: 'Service Worker scope: ' + reg.scope, duration: 2500, color: 'medium' });
          await t.present();
        }
      } catch (swErr) {
        // ignore sw registration errors here; continue to permission
      }

      const result = await this._pushService.requestPermission();
      this.notifStatus = result.status || this.notifStatus;

      if (result.token) {
        // try to register on backend
        try {
          await this._pushService.registerDevice(result.token, { source: 'web' });
          const toast = await this._toast.create({ message: 'Notificaciones activadas', duration: 3000, color: 'success' });
          await toast.present();
        } catch (err) {
          const toast = await this._toast.create({ message: 'Registración fallida', duration: 3000, color: 'danger' });
          await toast.present();
        }
      } else {
        const toast = await this._toast.create({ message: 'Permiso: ' + result.status, duration: 3000, color: 'warning' });
        await toast.present();
      }
    } catch (err) {
      const toast = await this._toast.create({ message: 'Error activando notificaciones', duration: 3000, color: 'danger' });
      await toast.present();
    }
  }

  private _stateDataListener(): void {
    this._stateService.stateModelListener()
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe((backState: any) => {
        this.backState = backState;

        this._cdr.markForCheck();
    });
  }
}
