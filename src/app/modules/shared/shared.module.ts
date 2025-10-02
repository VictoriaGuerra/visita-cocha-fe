import { EmptyStateComponent } from './components/empty-state/empty-state.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLeftSidebarComponent } from './components/main-left-sidebar/main-left-sidebar.component';
import { MainToolbarComponent } from './components/main-toolbar/main-toolbar.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CarouselModule, Carousel } from 'primeng/carousel';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { RouterModule } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { CategoryRepositoryService } from './services/main-category.repository-service';
import { InputNumberModule } from 'primeng/inputnumber';
import { TabViewModule } from 'primeng/tabview';
import { TermsConditionsComponent } from './components/terms-conditions/terms-conditions.component';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { BadgeModule } from 'primeng/badge';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService } from 'primeng/api';
import { ChipModule } from 'primeng/chip';
import { CalendarModule } from 'primeng/calendar';
import { DataViewModule } from 'primeng/dataview';
import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';
import { MenubarModule } from 'primeng/menubar';
import { SkeletonModule } from 'primeng/skeleton';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ImageModule } from 'primeng/image';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MainHeroComponent } from './components/main-hero/main-hero-page.component';
import { MenuIconComponent } from './components/menu-icon/menu-icon.component';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { ListTitleComponent } from './components/list-title/list-title.component';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { AtracttionCardComponent } from './components/location-card/location-card.component';
import { ItemListComponent } from './components/item-list/item-list.component';
import { PreventKeyboardDirective } from './utils/preventKeyboard.directive';
import { HttpClientModule } from '@angular/common/http';
import { FoodListComponent } from './components/food-list/food-list.component';
import { FooterComponent } from './components/footer/footer';
import { FaqComponent } from './components/faq/faq';
import { AccordionModule } from 'primeng/accordion';
import { dayNamePipe } from './pipes/day-name.pipe';
import { NewsListComponent } from './components/news-list/news-list.component';
import { QRCodeModule } from 'angularx-qrcode';
import { QrViewerComponent } from './components/qr-viewer/qr-viewer.component';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { SafeUrlPipe } from './pipes/url-sanitizer.pipe';
import { EventListComponent } from './components/event-list/event-list.component';
import { MainItineraryComponent } from './components/main-itinerary/main-itinerary.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';

@NgModule({
  declarations: [
    MainLeftSidebarComponent,
    MainToolbarComponent,
    TermsConditionsComponent,
    EmptyStateComponent,
    NotFoundPageComponent,
    MainHeroComponent,
    MenuIconComponent,
    CategoryListComponent,
    ListTitleComponent,
    AtracttionCardComponent,
    ItemListComponent,
    PreventKeyboardDirective,
    FoodListComponent,
    FooterComponent,
    FaqComponent,
    dayNamePipe,
    NewsListComponent,
    QrViewerComponent,
    SafeUrlPipe,
    EventListComponent,
    MainItineraryComponent,
    RegisterFormComponent
  ],
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    FormsModule,
    CarouselModule,
    CardModule,
    DropdownModule,
    PasswordModule,
    InputTextModule,
    RouterModule,
    ReactiveFormsModule,
    TooltipModule,
    InputNumberModule,
    TabViewModule,
    CheckboxModule,
    DividerModule,
    BadgeModule,
    ConfirmPopupModule,
    ChipModule,
    CalendarModule,
    DataViewModule,
    MenubarModule,
    SkeletonModule,
    BreadcrumbModule,
    OverlayPanelModule,
    ImageModule,
    ConfirmDialogModule,
    TagModule,
    RatingModule,
    HttpClientModule,
    AccordionModule,
    QRCodeModule,
    DynamicDialogModule
  ],
  exports: [
    MainLeftSidebarComponent,
    MainToolbarComponent,
    FormsModule,
    CarouselModule,
    CardModule,
    DropdownModule,
    IonicModule,
    PasswordModule,
    InputTextModule,
    ReactiveFormsModule,
    TooltipModule,
    InputNumberModule,
    TabViewModule,
    TermsConditionsComponent,
    CheckboxModule,
    DividerModule,
    EmptyStateComponent,
    BadgeModule,
    ConfirmPopupModule,
    ChipModule,
    CalendarModule,
    DataViewModule,
    NotFoundPageComponent,
    SkeletonModule,
    BreadcrumbModule,
    OverlayPanelModule,
    ImageModule,
    ConfirmDialogModule,
    MainHeroComponent,
    MenuIconComponent,
    CategoryListComponent,
    ListTitleComponent,
    TagModule,
    RatingModule,
    AtracttionCardComponent,
    ItemListComponent,
    PreventKeyboardDirective,
    FoodListComponent,
    FooterComponent,
    FaqComponent,
    NewsListComponent,
    QrViewerComponent,
    SafeUrlPipe,
    EventListComponent,
    MainItineraryComponent,
    RegisterFormComponent
  ],
  providers: [
    CategoryRepositoryService,
    ConfirmationService,
    DialogService
  ]
})
export class SharedModule {
  constructor() {
    Carousel.prototype.onTouchMove = () => { };
  }
}
