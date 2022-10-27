import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Category, Product } from 'src/app/app.models';
import { AppSettings, Settings } from 'src/app/app.settings';
import { AdvertisementsService } from 'src/app/services/advertisements.service';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { BannersService } from 'src/app/services/banners.service';

@Component({
  selector: 'app-advertisements',
  templateUrl: './advertisements.component.html',
  styleUrls: ['./advertisements.component.scss']
})
export class AdvertisementsComponent implements OnInit {
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
  public slides = [];
  public advertisements: Array<any> = [];
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
    public catService: CategoriesService,
    public auth: AuthService,
    public adService: AdvertisementsService,
    public bannerService: BannersService) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.settings = this.appSettings.settings;
  }

  ngOnInit(): void {
    this.getBanners();
    this.qSub = this.activatedRoute.queryParams.subscribe(params => {
      if (params['query']) {
        this.parsedQuery = params['query'].split(' ').join(',');
        this.query = params['query'];
      }
      this.getAllAds();
      this.getCategories();
    })
    this.sub = this.activatedRoute.params.subscribe(params => {
      if (params['cid']) this.cid = params['cid'];
      this.getAllAds();
      this.getCategories();
    });

    if (window.innerWidth < 960) {
      this.sidenavOpen = false;
    };
  }

  public getAllAds(page: number = 1, limit: number = 20) {
    if (this.auth.isLoggedIn) {
      this.auth.getToken().subscribe(t => {
        this.adService.getAdvertisementsForLoggedUser(page, limit, t, this.parsedQuery, this.cid).subscribe(data => {
          this.advertisements = data.items;
          this.totalItems = data.totalItems;
        });
      })
    } else {
      this.adService.getAdvertisements(page, limit, this.parsedQuery, this.cid).subscribe(data => {
        this.advertisements = data.items;
        this.totalItems = data.totalItems;
      });
    }
  }

  public getBanners() {
    this.bannerService.getBanners().subscribe(data => {
      this.slides = data.filter(x => x.banner_type_id == 2);
    })
  }


  public getCategories() {
    this.catService.getAdCategories().subscribe(data => {
      this.categories = data;
      this.categoryDesc = this.cid ? this.categories.find(c => c.id == this.cid).description : null;
    });
  }


}
