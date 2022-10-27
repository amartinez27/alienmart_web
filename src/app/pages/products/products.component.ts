import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ProductDialogComponent } from '../../shared/products-carousel/product-dialog/product-dialog.component';
import { AppService } from '../../services/app.service';
import { Product, Category } from "../../app.models";
import { Settings, AppSettings } from 'src/app/app.settings';
import { ProductService } from 'src/app/services/products.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  @ViewChild('sidenav', { static: true }) sidenav: any;
  public sidenavOpen: boolean = true;
  private sub: any;
  private qSub: any;
  public query: any = null;
  public parsedQuery: string = null;
  public cid: any = null;
  public categoryDesc: any = null;
  public viewCol: number = 20;
  public count = 20;
  public products: Array<Product> = [];
  public categories: Category[];
  public totalItems = -1;
  public priceFrom: number = 750;
  public priceTo: number = 1599;
  public page: any;
  public settings: Settings;
  constructor(public appSettings: AppSettings,
    private activatedRoute: ActivatedRoute,
    public appService: AppService,
    public dialog: MatDialog,
    private router: Router,
    public prodService: ProductService,
    public catService: CategoriesService,
    public auth: AuthService) {
    this.settings = this.appSettings.settings;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    this.qSub = this.activatedRoute.queryParams.subscribe(params => {
      if (params['query']) {
        this.parsedQuery = params['query'].split(' ').join(',');
        this.query = params['query'];
      }
      this.getAllProducts();
      this.getCategories();
    })
    this.sub = this.activatedRoute.params.subscribe(params => {
      if (params['cid']) this.cid = params['cid'];
      this.getAllProducts();
      this.getCategories();
    });

    if (window.innerWidth < 960) {
      this.sidenavOpen = false;
    };
  }

  public getAllProducts(page: number = 1, limit: number = 20) {
    if (this.auth.isLoggedIn) {
      this.auth.getToken().subscribe(t => {
        this.prodService.getProductsForLoggedUser(page, limit, t, this.parsedQuery, this.cid).subscribe(data => {
          this.products = data.items;
          this.totalItems = data.totalItems;
        });
      })
    } else {
      this.prodService.getProducts(page, limit, this.parsedQuery, this.cid).subscribe(data => {
        this.products = data.items;
        this.totalItems = data.totalItems;
      });
    }
  }

  public getCategories() {
    if (this.appService.Data.categories.length == 0) {
      this.catService.getCategories().subscribe(data => {
        this.categories = data;
        this.appService.Data.categories = data;
        this.categoryDesc = this.cid ? this.categories.find(c => c.id == this.cid).description : null;
      });
    }
    else {
      this.categories = this.appService.Data.categories;
      this.categoryDesc = this.cid ? this.categories.find(c => c.id == this.cid).description : null;
    }

  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  @HostListener('window:resize')
  public onWindowResize(): void {
    (window.innerWidth < 960) ? this.sidenavOpen = false : this.sidenavOpen = true;
  }

  public changeCount(count) {
    this.count = count;
    this.getAllProducts();
  }


  public openProductDialog(product) {
    let dialogRef = this.dialog.open(ProductDialogComponent, {
      data: product,
      panelClass: 'product-dialog',
      direction: (this.settings.rtl) ? 'rtl' : 'ltr'
    });
    dialogRef.afterClosed().subscribe(product => {
      if (product) {
        this.router.navigate(['/products', product.id, product.name]);
      }
    });
  }

  public onPageChanged(event) {
    this.page = event;
    this.getAllProducts(this.page);
    window.scrollTo(0, 0);
  }

  public onChangeCategory(event) {
    if (event.target) {
      this.router.navigate(['/products', event.target.innerText.toLowerCase()]);
    }
  }

}
