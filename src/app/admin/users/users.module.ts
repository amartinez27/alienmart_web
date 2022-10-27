import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../shared/shared.module';
import { PipesModule } from '../../theme/pipes/pipes.module';
import { UsersComponent } from './users.component';
import { UsersData } from './users.data';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { UserDetailsComponent } from './user-details/user-details.component';

export const routes = [
  { path: '', component: UsersComponent, pathMatch: 'full' },
  { path: ':id', component: UserDetailsComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    InMemoryWebApiModule.forRoot(UsersData, { delay: 500 }),
    NgxPaginationModule,
    SharedModule,
    PipesModule
  ],
  declarations: [
    UsersComponent,
    UserDialogComponent,
    UserDetailsComponent
  ]
})
export class UsersModule { }
