import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromosComponent } from './promos.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'src/app/shared/shared.module';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
export const routes = [
  { path: '', component: PromosComponent, pathMatch: 'full' }
];
@NgModule({
  declarations: [PromosComponent],
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
export class PromosModule { }
