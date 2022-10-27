import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerifyUserComponent } from './verify-user/verify-user.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

export const routes = [
  { path: '', component: VerifyUserComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [VerifyUserComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class VerifyModule { }
