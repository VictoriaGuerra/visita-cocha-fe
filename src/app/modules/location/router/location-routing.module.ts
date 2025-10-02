import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailFoodPage } from '../pages/detail-food/detail-food.page';
import { DetailItemPage } from '../pages/detail-item/detail-item.page';
import { HomeListPage } from '../pages/home-list/home-list.page';
import { LocationFormPage } from '../pages/location-form/location-form.page';
import { SearchListPage } from '../pages/search-list/search-list.page';

const routes: Routes = [
  {
    path: ':module',
    component: HomeListPage
  },
  {
    path: 'search/category/:categoryId',
    component: SearchListPage
  },
  {
    path: 'detail/:module/:itemId',
    component: DetailItemPage
  },
  {
    path: 'search/food/:foodId',
    component: DetailFoodPage
  },
  {
    path: 'add/new-place',
    component: LocationFormPage
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class LocationRoutingModule {}
