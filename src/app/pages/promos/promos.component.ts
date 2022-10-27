import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/products.service';
import { BannersService } from 'src/app/services/banners.service';

@Component({
  selector: 'app-promos',
  templateUrl: './promos.component.html',
  styleUrls: ['./promos.component.scss']
})
export class PromosComponent implements OnInit {
  public slides = [];
  public products: Array<any> = [];
  public query: any = null;
  public parsedQuery: string = null;
  totalItems = 0;
  public count = 20;
  public page: any;

  constructor(public auth: AuthService, public prodService: ProductService, public bannerService: BannersService) { }

  ngOnInit(): void {
    this.getBanners();
    this.getAllProducts();
  }

  public getAllProducts(page: number = 1, limit: number = 20) {
    if (this.auth.isLoggedIn) {
      this.auth.getToken().subscribe(t => {
        this.prodService.getProductsForLoggedUser(page, limit, t, null, null, true).subscribe(data => {
          this.products = data.items;
          this.totalItems = data.totalItems;
        });
      })
    } else {
      this.prodService.getProducts(page, limit, null, null, true).subscribe(data => {
        this.products = data.items;
        this.totalItems = data.totalItems;
      });
    }
  }

  public getBanners() {
    this.bannerService.getBanners().subscribe(data => {
      this.slides = data.filter(x => x.banner_type_id == 3);
    })
  }

  onPageChanged(event) {
    window.scrollTo(0, 0);
    this.page = event;
    if (this.auth.isLoggedIn) {
      this.auth.getToken().subscribe(t => {
        this.prodService.getProductsForLoggedUser(event, 20, t, null, null, true).subscribe(data => {
          this.products = data.items;
          this.totalItems = data.totalItems;
        });
      })
    } else {
      this.prodService.getProducts(event, 20, null, null, true).subscribe(data => {
        this.products = data.items;
        this.totalItems = data.totalItems;
      });
    }
  }


}
