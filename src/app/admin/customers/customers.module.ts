import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { CustomersComponent } from './customers.component';
import { CustomerDialogComponent } from './customer-dialog/customer-dialog.component';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';

export const routes = [
  { path: '', component: CustomersComponent, pathMatch: 'full' },
  { path: ':id', component: CustomerDetailComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    CustomersComponent,
    CustomerDialogComponent,
    CustomerDetailComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule,
    NgxPaginationModule
  ]
})
export class CustomersModule { }
