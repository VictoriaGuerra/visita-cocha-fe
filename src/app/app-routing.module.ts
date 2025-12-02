import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NotFoundPageComponent } from './modules/shared/components/not-found-page/not-found-page.component';
import { TransportRoutesPageComponent } from './modules/shared/components/transport-routes-page/transport-routes-page.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/home/home.module')
      .then(m => m.HomeModule)
  },
  {
    path: 'map',
    loadChildren: () => import('./modules/map/map.module')
      .then(m => m.MapModule)
  },
  {
    path: '',
    loadChildren: () => import('./modules/location/location.module')
      .then(m => m.LocationModule),
    data: {
      animated: false
    }
  },
  {
    path: 'event',
    loadChildren: () => import('./modules/event/event.module')
      .then(m => m.EventModule),
    data: {
      animated: false
    }
  },
  {
    path: 'not-found',
    component: NotFoundPageComponent
  },
  {
    path: 'transport-routes',
    component: TransportRoutesPageComponent,
    data: { title: 'Rutas de transporte' }
  },
  {
    path: '**',
    redirectTo: 'not-found/page',
    pathMatch: 'full'
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
