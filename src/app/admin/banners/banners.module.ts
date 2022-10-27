import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { BannersListComponent } from './banners-list/banners-list.component';
import { AddBannerComponent } from './add-banner/add-banner.component';
import { InputFileModule } from 'ngx-input-file';
import { ReactiveFormsModule } from '@angular/forms';

export const routes = [
  { path: '', redirectTo: 'banners-list', pathMatch: 'full' },
  { path: 'banners-list', component: BannersListComponent, data: { breadcrumb: 'Banners List' } },
  { path: 'add-banner', component: AddBannerComponent, data: { breadcrumb: 'Add Banner' } },

];

@NgModule({
  declarations: [BannersListComponent, AddBannerComponent],
  imports: [
    CommonModule,
    NgxPaginationModule,
    SharedModule,
    RouterModule.forChild(routes),
    InputFileModule,
    ReactiveFormsModule
  ]
})
export class BannersModule { }
