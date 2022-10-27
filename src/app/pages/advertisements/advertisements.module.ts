import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdvertisementsComponent } from './advertisements.component';
import { AdvertisementComponent } from './advertisement/advertisement.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { SwiperModule } from 'ngx-swiper-wrapper';


export const routes = [
  { path: '', component: AdvertisementsComponent, pathMatch: 'full' },
  { path: ':type', component: AdvertisementsComponent },
  { path: 'category/:cid/:name', component: AdvertisementsComponent },
  { path: ':id/:name', component: AdvertisementComponent }
];

@NgModule({
  declarations: [AdvertisementComponent, AdvertisementsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    SwiperModule,
    NgxPaginationModule,
    SharedModule,
    PipesModule
  ]
})
export class AdvertisementsModule { }
