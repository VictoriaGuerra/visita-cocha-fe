import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationRoutingModule } from './router/location-routing.module';
import { HomeListPage } from './pages/home-list/home-list.page';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../shared/shared.module';
import { TabMenuModule } from 'primeng/tabmenu';
import { HeroListComponent } from './components/hero-list/hero-list.component';
import { HomeCategoryListComponent } from './components/home-category-list/home-category-list.component';
import { SearchListPage } from './pages/search-list/search-list.page';
import { DetailItemPage } from './pages/detail-item/detail-item.page';
import { HeroDetailComponent } from './components/hero-detail/hero-detail.component';
import { AccordionModule } from 'primeng/accordion';
import { ContactDetailComponent } from './components/contact-detail/contact-detail.component';
import { InformationDetailComponent } from './components/information-detail/information-detail.component';
import { MapDetailComponent } from './components/map-detail/map-detail.component';
import { BlockUIModule } from 'primeng/blockui';
import { DetailFoodPage } from './pages/detail-food/detail-food.page';
import { LocationFormPage } from './pages/location-form/location-form.page';
import { MultiSelectModule } from 'primeng/multiselect';
import { NewLocationFormComponent } from './components/new-location-form/new-location-form.component';
import { DeliveryIframeComponent } from './components/delivery-iframe/delivery-iframe';
import { HistoryDetailComponent } from './components/history-detail/history-detail.component';


@NgModule({
  declarations: [
    HomeListPage,
    SearchListPage,
    HeroListComponent,
    HomeCategoryListComponent,
    DetailItemPage,
    HeroDetailComponent,
    ContactDetailComponent,
    InformationDetailComponent,
    MapDetailComponent,
    DetailFoodPage,
    LocationFormPage,
    NewLocationFormComponent,
    DeliveryIframeComponent,
    HistoryDetailComponent
  ],
  imports: [
    CommonModule,
    LocationRoutingModule,
    IonicModule,
    SharedModule,
    TabMenuModule,
    AccordionModule,
    BlockUIModule,
    MultiSelectModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LocationModule { }
