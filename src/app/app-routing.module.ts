import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NotFoundPageComponent } from './modules/shared/components/not-found-page/not-found-page.component';
import { AtractivosListComponent } from './pages/atractivos-list/atractivos-list.component';

const routes: Routes = [
  // PON LA RUTA DE ATRACTIVOS PRIMERO
  {
    path: 'atractivos',
    component: AtractivosListComponent
  },
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
  // QUITA esta ruta duplicada con path vacío o cámbiala a otra ruta
  // {
  //   path: '',
  //   loadChildren: () => import('./modules/location/location.module')
  //     .then(m => m.LocationModule),
  //   data: {
  //     animated: false
  //   }
  // },
  {
    path: 'location',  // ← CAMBIA a 'location' en lugar de ''
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
    path: '**',
    redirectTo: 'not-found/page',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { 
      preloadingStrategy: PreloadAllModules,
      useHash: true  // ← AÑADE ESTO TEMPORALMENTE
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
