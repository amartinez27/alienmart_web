import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

import { InputFileConfig, InputFileModule } from 'ngx-input-file';
const config: InputFileConfig = {
  fileAccept: '*'
};

import { AdminComponent } from './admin.component';
import { MenuComponent } from './components/menu/menu.component';
import { UserMenuComponent } from './components/user-menu/user-menu.component';
import { FullScreenComponent } from './components/fullscreen/fullscreen.component';
import { MessagesComponent } from './components/messages/messages.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { IsadminGuard } from '../services/isadmin.guard';
import { IssellerGuard } from '../services/isseller.guard';

export const routes = [
  {
    path: '',
    component: AdminComponent, children: [
      { path: '', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
      { path: 'products', loadChildren: () => import('./products/products.module').then(m => m.ProductsModule), canActivate: [IssellerGuard] },
      { path: 'sales', loadChildren: () => import('./sales/sales.module').then(m => m.SalesModule), canActivate: [IssellerGuard] },
      { path: 'users', loadChildren: () => import('./users/users.module').then(m => m.UsersModule), data: { breadcrumb: 'Users' }, canActivate: [IsadminGuard] },
      { path: 'customers', loadChildren: () => import('./customers/customers.module').then(m => m.CustomersModule), canActivate: [IsadminGuard] },
      { path: 'banners', loadChildren: () => import('./banners/banners.module').then(m => m.BannersModule), data: { breadcrumb: 'Banners' }, canActivate: [IsadminGuard] },
      { path: 'verify', loadChildren: () => import('./verify/verify.module').then(m => m.VerifyModule), data: { breadcrumb: 'Verify' } },
      { path: 'advertisements', loadChildren: () => import('./advertisements/advertisements.module').then(m => m.AdvertisementsModule), data: { breadcrumb: 'Advertisements' } },
      { path: 'account', loadChildren: () => import('./account/account.module').then(m => m.AccountModule), data: { breadcrumb: 'Account' } },
      { path: 'faqs', loadChildren: () => import('./faqs/faqs.module').then(m => m.FaqsModule), data: { breadcrumb: 'FAQS' } },
      { path: 'ads', loadChildren: () => import('./ad-sales/ad-sales.module').then(m => m.AdSalesModule), canActivate: [IsadminGuard] }
    ]
  }
];

@NgModule({
  declarations: [
    AdminComponent,
    MenuComponent,
    UserMenuComponent,
    FullScreenComponent,
    MessagesComponent,
    BreadcrumbComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    InputFileModule.forRoot(config)
  ]
})
export class AdminModule { }
