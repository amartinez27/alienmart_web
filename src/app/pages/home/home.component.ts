import { Component, OnInit } from '@angular/core';
import { AppService } from '../../services/app.service';
import { Product } from "../../app.models";
import { ProductService } from 'src/app/services/products.service';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { AuthService } from 'src/app/services/auth.service';
import { BannersService } from 'src/app/services/banners.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public slides = [
    /*{ title: '', subtitle: '', image: 'assets/images/carousel/banner1.jpg' }
    { title: 'Summer collection', subtitle: 'New Arrivals On Sale', image: 'assets/images/carousel/banner2.jpg' },
    { title: 'The biggest sale', subtitle: 'Special for today', image: 'assets/images/carousel/banner3.jpg' },
    { title: 'Summer collection', subtitle: 'New Arrivals On Sale', image: 'assets/images/carousel/banner4.jpg' },
    { title: 'The biggest sale', subtitle: 'Special for today', image: 'assets/images/carousel/banner5.jpg' }*/
  ];



  public brands = [];
  public banners = [];
  public mainCategories = [];
  public featuredProducts: Array<any>;
  public onSaleProducts: Array<Product>;
  public topRatedProducts: Array<Product>;
  public newArrivalsProducts: Array<Product>;
  public config: SwiperConfigInterface = {}

  constructor(public appService: AppService, public prodService: ProductService, public auth: AuthService, public bannerService: BannersService) { }

  ngOnInit() {
    this.getBanners();
    this.getCategories();
    this.getProducts("featured");
    this.getBrands();
  }

  ngAfterViewInit() {
    this.config = {
      observer: true,
      slidesPerView: 1,
      spaceBetween: 16,
      keyboard: true,
      navigation: true,
      pagination: false,
      grabCursor: true,
      loop: false,
      preloadImages: false,
      lazy: true,
      autoplay: {
        delay: 5000,
      },
      breakpoints: {
        480: {
          slidesPerView: 1
        },
        740: {
          slidesPerView: 2,
        },
        960: {
          slidesPerView: 3,
        },
        1280: {
          slidesPerView: 4,
        },
        1500: {
          slidesPerView: 5,
        }
      }
    }

  }

  ngAfterContentInit() {
    this.mainCategories = this.appService.Data.categories.reverse();
  }

  public getCategories() {
    this.appService.getCategories().subscribe(data => {
      this.mainCategories = data.filter(c => c.parent_id == null && c.is_featured == false).reverse();
    })
  }

  public onLinkClick(e) {
    this.getProducts(e.tab.textLabel.toLowerCase());
  }

  public getProducts(type) {
    if (type == "featured" && !this.featuredProducts) {
      /*this.appService.getProducts("featured").subscribe(data => {
        this.featuredProducts = data;
      })*/
      if (this.auth.isLoggedIn) {
        this.auth.getToken().subscribe(token => {
          this.prodService.getProductsForLoggedUser(1, 20, token).subscribe(products => {
            this.featuredProducts = products.items;
          })
        })
      } else {
        this.prodService.getProducts(1, 20).subscribe(products => {
          this.featuredProducts = products.items;
        }, error => {
        })
      }
    }

  }

  public getBanners() {
    this.bannerService.getBanners().subscribe(data => {
      this.slides = data.filter(x => x.banner_type_id == 1);
    })
  }

  public getBrands() {
    this.brands = this.appService.getBrands();
  }

}
