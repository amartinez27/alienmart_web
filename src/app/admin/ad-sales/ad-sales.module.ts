import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdSalesComponent } from './ad-sales.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { InputFileModule } from 'ngx-input-file';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

export const routes = [
  { path: '', redirectTo: 'purchases', pathMatch: 'full' },
  { path: 'purchases', component: AdSalesComponent }

];

@NgModule({
  declarations: [AdSalesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule,
    InputFileModule,
    NgxPaginationModule
  ]
})
export class AdSalesModule { }
