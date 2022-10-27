import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Settings, AppSettings } from '../app.settings';
import { AppService } from '../services/app.service';
import { Category, Product } from '../app.models';
import { SidenavMenuService } from '../theme/components/sidenav-menu/sidenav-menu.service';
import { CategoriesService } from '../services/categories.service';
import { WishlistService } from '../services/wishlist.service';
import { AuthService } from '../services/auth.service';
import { SidenavMenu } from '../theme/components/sidenav-menu/sidenav-menu.model';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
  providers: [SidenavMenuService]
})
export class PagesComponent implements OnInit {
  public showBackToTop: boolean = false;
  public categories: Category[];
  public category: Category;
  searchIn: string = 'eshop';
  public sidenavMenuItems: Array<any> = [];
  sideNavMenu: Array<any> = [];
  @ViewChild('sidenav', { static: true }) sidenav: any;

  public settings: Settings;
  constructor(public appSettings: AppSettings,
    public appService: AppService,
    public sidenavMenuService: SidenavMenuService,
    public router: Router,
    public catService: CategoriesService,
    public wishlistService: WishlistService,
    public auth: AuthService) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    if (this.appSettings.currentUser) {
      this.getUserWishlist();
    }
    this.getCategories();
    //this.sidenavMenuItems = this.sidenavMenuService.getSidenavMenuItems();
  }

  getCategories() {

    this.catService.getJsonAdCategories().subscribe(data => {
      this.sideNavMenu = [];
      data.forEach(x => {
        this.sideNavMenu.push(new SidenavMenu(x.id, x.description, `/advertisements/category/${x.id}/${x.description}`, null, null, false, 0))
      });
      //this.sidenavMenuItems = this.sideNavMenu;
    })
    this.catService.getJsonCategories().subscribe(data => {
      //this.sideNavMenu = [];
      data.forEach(x => {
        this.sideNavMenu.push(new SidenavMenu(x.id, x.description, `/products/category/${x.id}/${x.description}`, null, null, x.children ? true : false, x.parent_id ? x.parent_id : 0))
        x.children?.forEach(e => {
          this.sideNavMenu.push(new SidenavMenu(e.id, e.description, `/products/category/${e.id}/${e.description}`, null, null, e.children ? true : false, x.id))
          e.children?.forEach(y => {
            this.sideNavMenu.push(new SidenavMenu(y.id, y.description, `/products/category/${y.id}/${y.description}`, null, null, y.children ? true : false, e.id))
          });
        });
      });
      this.sidenavMenuItems = this.sideNavMenu;
    })
  }

  public async getUserWishlist() {
    this.auth.getToken().subscribe(token => {
      this.wishlistService.getUsersWishlist(token).subscribe(data => {
        this.appService.Data.wishList = data;
      })
    })
  }

  public changeSearch(searchIn) {
    this.searchIn = searchIn;
  }


  public remove(product) {
    const index: number = this.appService.Data.cartList.indexOf(product);
    if (index !== -1) {
      this.appService.Data.cartList.splice(index, 1);
      this.appService.Data.totalPrice = this.appService.Data.totalPrice - product.price * product.cart_count;
      this.appService.Data.totalcart_count = this.appService.Data.totalcart_count - product.cart_count;
      this.appService.resetProductcart_count(product);
    }
  }

  public clear() {
    this.appService.Data.cartList.forEach(product => {
      this.appService.resetProductcart_count(product);
    });
    this.appService.Data.cartList.length = 0;
    this.appService.Data.totalPrice = 0;
    this.appService.Data.totalcart_count = 0;
  }


  public changeTheme(theme) {
    this.settings.theme = theme;
  }

  public stopClickPropagate(event: any) {
    event.stopPropagation();
    event.preventDefault();
  }

  public search(event, value) {
    event.stopPropagation();
    event.preventDefault();
    if (this.searchIn == 'eshop') {
      this.router.navigate(['/products'], { queryParams: { query: value } })
    } else {
      this.router.navigate(['/advertisements'], { queryParams: { query: value } })
    }
  }


  public scrollToTop() {
    var scrollDuration = 200;
    var scrollStep = -window.pageYOffset / (scrollDuration / 20);
    var scrollInterval = setInterval(() => {
      if (window.pageYOffset != 0) {
        window.scrollBy(0, scrollStep);
      }
      else {
        clearInterval(scrollInterval);
      }
    }, 10);
    if (window.innerWidth <= 768) {
      setTimeout(() => { window.scrollTo(0, 0) });
    }
  }
  @HostListener('window:scroll', ['$event'])
  onWindowScroll($event) {
    ($event.target.documentElement.scrollTop > 300) ? this.showBackToTop = true : this.showBackToTop = false;
  }

  ngAfterViewInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.sidenav.close();
      }
    });
    //this.sidenavMenuService.expandActiveSubMenu(this.sidenavMenuService.getSidenavMenuItems());
    this.sidenavMenuService.expandActiveSubMenu(this.sidenavMenuItems);
  }

  public closeSubMenus() {
    if (window.innerWidth < 960) {
      this.sidenavMenuService.closeAllSubMenus();
    }
  }

}