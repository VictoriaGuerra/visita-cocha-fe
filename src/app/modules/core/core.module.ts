import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SharedModule } from '../shared/shared.module';
import { WrapperComponent } from './components/wrapper/wrapper.component';
import { MainTabsComponent } from './components/main-tabs/main-tabs.component';

@NgModule({
  declarations: [
    WrapperComponent,
    MainTabsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    IonicModule.forRoot(),
    SharedModule
  ],
  exports: [
    WrapperComponent
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ]
})
export class CoreModule { }
