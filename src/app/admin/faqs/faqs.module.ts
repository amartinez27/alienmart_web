import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaqsComponent } from './faqs.component';
import { FaqsDialogComponent } from './faqs-dialog/faqs-dialog.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

export const routes = [
  { path: '', component: FaqsComponent, pathMatch: 'full' }
];


@NgModule({
  declarations: [FaqsComponent, FaqsDialogComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class FaqsModule { }
