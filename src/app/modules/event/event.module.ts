import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventRoutingModule } from './router/event-routing.module';
import { MapEventComponent } from './pages/map-event/map-event.component';
import { IonicModule } from '@ionic/angular';
import { GMapModule } from 'primeng/gmap';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InfoMapComponent } from './components/info-map/info-map.component';

@NgModule({
  declarations: [
    MapEventComponent,
    InfoMapComponent
  ],
  imports: [
    CommonModule,
    EventRoutingModule,
    IonicModule,
    GMapModule,
    FormsModule,
    HttpClientModule,
  ]
})
export class EventModule { }
