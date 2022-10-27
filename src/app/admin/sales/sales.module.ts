import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { OrdersComponent } from './orders/orders.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SaleDetailComponent } from './sale-detail/sale-detail.component';
import { InputFileModule } from 'ngx-input-file';

export const routes = [
  { path: '', component: OrdersComponent, data: { breadcrumb: 'Orders' } },
  { path: ':id', component: SaleDetailComponent, pathMatch: 'full' },
  { path: 'transactions', component: TransactionsComponent, data: { breadcrumb: 'Transactions' } }
];

@NgModule({
  declarations: [
    OrdersComponent,
    TransactionsComponent,
    SaleDetailComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    NgxPaginationModule,
    InputFileModule
  ]
})
export class SalesModule { }
