import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './router/home-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    IonicModule,
    SharedModule
  ]
})
export class HomeModule { }
