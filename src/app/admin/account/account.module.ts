import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InformationComponent } from './information/information.component';
import { AddressesComponent } from './addresses/addresses.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { InputFileModule } from 'ngx-input-file';
import { OrdersComponent } from './orders/orders.component';
import { OrderIssueDialogComponent } from './orders/order-issue-dialog/order-issue-dialog.component';
import { OrderDetailComponent } from './orders/order-detail/order-detail.component';

export const routes = [
  { path: '', redirectTo: 'information', pathMatch: 'full' },
  { path: 'information', component: InformationComponent },
  { path: 'addresses', component: AddressesComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'orders/:id', component: OrderDetailComponent },

];

@NgModule({
  declarations: [InformationComponent, AddressesComponent, OrdersComponent, OrderDetailComponent, OrderIssueDialogComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule,
    InputFileModule
  ]
})
export class AccountModule { }
