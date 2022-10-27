import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdvertisementListComponent } from './advertisement-list/advertisement-list.component';
import { AdvertisementBundleComponent } from './advertisement-bundle/advertisement-bundle.component';
import { AddAdvertisementComponent } from './add-advertisement/add-advertisement.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { InputFileModule } from 'ngx-input-file';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatStepperModule } from '@angular/material/stepper';
import { BundlesListComponent } from './bundles-list/bundles-list.component';
import { PaymentDialogComponent } from './payment-dialog/payment-dialog.component';
import { AdminViewComponent } from './admin-view/admin-view.component';

export const routes = [
  { path: '', redirectTo: 'advertisement-list', pathMatch: 'full' },
  { path: 'advertisement-list', component: AdvertisementListComponent },
  { path: 'ad-bundle', component: AdvertisementBundleComponent },
  { path: 'add-advertisement', component: AddAdvertisementComponent },
  { path: 'add-advertisement/:id', component: AddAdvertisementComponent },
  { path: 'bundle-list', component: BundlesListComponent },
  { path: 'all', component: AdminViewComponent, data: { breadcrumb: 'Edit Ad' } },

];

@NgModule({
  declarations: [AdvertisementListComponent, AdvertisementBundleComponent, BundlesListComponent, AddAdvertisementComponent, PaymentDialogComponent, AdminViewComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule,
    InputFileModule,
    NgxPaginationModule,
    MatStepperModule
  ]
})
export class AdvertisementsModule { }
