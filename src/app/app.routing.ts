import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { PagesComponent } from './pages/pages.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { HelpComponent } from './pages/help/help.component';
import { RouterGuardianGuard } from './services/router-guardian.guard';
import { AdminGuardGuard } from './services/admin-guard.guard';
import { SellComponent } from './pages/sell/sell.component';

export const routes: Routes = [
    {
        path: '',
        component: PagesComponent, children: [
            { path: '', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) },
            { path: 'compare', loadChildren: () => import('./pages/compare/compare.module').then(m => m.CompareModule), data: { breadcrumb: 'Compare' } },
            { path: 'wishlist', loadChildren: () => import('./pages/wishlist/wishlist.module').then(m => m.WishlistModule), data: { breadcrumb: 'Wishlist' } },
            { path: 'cart', loadChildren: () => import('./pages/cart/cart.module').then(m => m.CartModule), data: { breadcrumb: 'Cart' } },
            { path: 'checkout', loadChildren: () => import('./pages/checkout/checkout.module').then(m => m.CheckoutModule), data: { breadcrumb: 'Checkout' } },
            { path: 'sign-in', loadChildren: () => import('./pages/sign-in/sign-in.module').then(m => m.SignInModule), data: { breadcrumb: 'Sign In ' }, canActivate: [RouterGuardianGuard] },
            { path: 'products', loadChildren: () => import('./pages/products/products.module').then(m => m.ProductsModule), data: { breadcrumb: 'All Products' } },
            { path: 'on-sale', loadChildren: () => import('./pages/promos/promos.module').then(m => m.PromosModule), data: { breadcrumb: 'All Products' } },
            { path: 'advertisements', loadChildren: () => import('./pages/advertisements/advertisements.module').then(m => m.AdvertisementsModule), data: { breadcrumb: 'All Advertisements' } },
            { path: 'help', component: HelpComponent },
            { path: 'sell-on-alienmart', component: SellComponent }
        ]
    },
    { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule), canActivate: [AdminGuardGuard] },
    { path: '**', component: NotFoundComponent }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            preloadingStrategy: PreloadAllModules, // <- comment this line for activate lazy load
            relativeLinkResolution: 'legacy',
            // useHash: true
        })
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }