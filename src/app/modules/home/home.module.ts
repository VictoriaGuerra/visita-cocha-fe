import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './router/home-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../shared/shared.module';

// 👇 IMPORTA TUS COMPONENTES
import { ListadoAtractivosComponent } from '../../componentes/listado-atractivos/listado-atractivos.component';
import { DetalleAtractivoComponent } from './components/detalleatractivo/detalleatractivo.component';

@NgModule({
  declarations: [
    HomeComponent,
    ListadoAtractivosComponent, // 👈 AGREGA ESTE
    DetalleAtractivoComponent   // 👈 Y ESTE
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    IonicModule,
    SharedModule
  ]
})
export class HomeModule { }
