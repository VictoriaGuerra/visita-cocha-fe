import {AngularFireModule} from '@angular/fire/compat';
import {AngularFireMessagingModule} from '@angular/fire/compat/messaging';
import {AngularFireAnalyticsModule} from "@angular/fire/compat/analytics";
import {ScreenTrackingService, UserTrackingService} from '@angular/fire/analytics';
import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SidebarModule} from 'primeng/sidebar';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule, HAMMER_GESTURE_CONFIG, HammerModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {AppRoutingModule} from './app-routing.module';
import {CoreModule} from './modules/core/core.module';
import {SharedModule} from './modules/shared/shared.module';
import {AppComponent} from './app.component';
import {UchHammerConfigService} from './config/hammer.config-service';
import {environment} from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireMessagingModule,
    AngularFireAnalyticsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CoreModule,
    HammerModule,
    SharedModule,
    SidebarModule
  ],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    },
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: UchHammerConfigService
    },
    ScreenTrackingService,
    UserTrackingService
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
