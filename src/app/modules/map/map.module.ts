import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapRoutingModule } from './router/map-routing.module';
import { MapHomeComponent } from './pages/map-home/map-home.component';
import { IonicModule } from '@ionic/angular';
import { GMapModule } from 'primeng/gmap';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InfoMapComponent } from './components/info-map/info-map.component';

@NgModule({
  declarations: [
    MapHomeComponent,
    InfoMapComponent
  ],
  imports: [
    CommonModule,
    MapRoutingModule,
    IonicModule,
    GMapModule,
    FormsModule,
    HttpClientModule,
  ]
})
export class MapModule { }
