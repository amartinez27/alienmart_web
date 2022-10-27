import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AdvertisementsService } from 'src/app/services/advertisements.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwiperDirective, SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { ProductZoomComponent } from '../../products/product/product-zoom/product-zoom.component';
import { CategoriesService } from 'src/app/services/categories.service';

@Component({
  selector: 'app-advertisement',
  templateUrl: './advertisement.component.html',
  styleUrls: ['./advertisement.component.scss']
})
export class AdvertisementComponent implements OnInit {
  @ViewChild('zoomViewer', { static: true }) zoomViewer;
  @ViewChild(SwiperDirective, { static: true }) directiveRef: SwiperDirective;
  public config: SwiperConfigInterface = {};
  public product: any;
  public image: any;
  public zoomImage: any;
  private sub: any;
  public form: FormGroup;
  public questionForm: FormGroup;
  public rating = -1;
  public ratingError = false;
  public relatedProducts: Array<any>;
  public categories: any = [];

  constructor(public appService: AppService, private activatedRoute: ActivatedRoute,
    public dialog: MatDialog, public formBuilder: FormBuilder,
    public adService: AdvertisementsService, public auth: AuthService, public snackBar: MatSnackBar, public categoryService: CategoriesService, public router: Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

  }

  ngOnInit() {
    this.getCategories();
    this.sub = this.activatedRoute.params.subscribe(params => {
      this.getProductById(params['id']);
    });
    this.form = this.formBuilder.group({
      'review': [null, Validators.required]
    });
    this.questionForm = this.formBuilder.group({
      question: [null, Validators.required]
    });
  }

  ngAfterViewInit() {
    this.config = {
      observer: false,
      slidesPerView: 4,
      spaceBetween: 10,
      keyboard: true,
      navigation: true,
      pagination: false,
      loop: false,
      preloadImages: false,
      lazy: true,
      breakpoints: {
        480: {
          slidesPerView: 2
        },
        600: {
          slidesPerView: 3,
        }
      }
    }
  }

  getCategories() {
    this.categoryService.getAdCategories().subscribe(categories => {
      this.categories = categories;
    })
  }

  public getProductById(id) {

    if (this.auth.isLoggedIn) {
      this.auth.getToken().subscribe(token => {
        this.adService.getAdvertisementByIdForLoggedUser(id, token).subscribe(prod => {
          this.product = prod;
          this.image = prod.images[0]?.url;
          this.zoomImage = prod.images[0]?.url;
          let catid = prod.category_path[0] ? prod.category_path[0] : prod.category_id;
          this.getRelatedProducts(catid, token);
          setTimeout(() => {
            this.config.observer = true;
            // this.directiveRef.setIndex(0);
          });
        })
      })
    } else {
      this.adService.getAdvertisementById(id).subscribe(prod => {
        this.product = prod;
        this.image = prod.images[0]?.url;
        this.zoomImage = prod.images[0]?.url;
        let catid = prod.category_path[0] ? prod.category_path[0] : prod.category_id;
        this.getRelatedProducts(catid);
        setTimeout(() => {
          this.config.observer = true;
          // this.directiveRef.setIndex(0);
        });
      })
    }
    /*this.appService.getProductById(id).subscribe(data => {
      this.product = data;
      this.image = data.images[0].medium;
      this.zoomImage = data.images[0].big;
      setTimeout(() => {
        this.config.observer = true;
        // this.directiveRef.setIndex(0);
      });
    });*/
  }

  public getRelatedProducts(id, token?) {
    /*this.appService.getProducts('related').subscribe(data => {
      this.relatedProducts = data;
    })*/
    if (this.auth.isLoggedIn) {
      this.adService.getAdvertisementsForLoggedUser(1, 10, token, null, id).subscribe(data => {
        this.relatedProducts = data.items;
      })
    } else {
      this.adService.getAdvertisements(1, 10, null, id).subscribe(data => {
        this.relatedProducts = data.items;
      })
    }
  }

  public selectImage(image) {
    this.image = image.url;
    this.zoomImage = image.url;
  }

  public onMouseMove(e) {
    if (window.innerWidth >= 1280) {
      var image, offsetX, offsetY, x, y, zoomer;
      image = e.currentTarget;
      offsetX = e.offsetX;
      offsetY = e.offsetY;
      x = offsetX / image.offsetWidth * 100;
      y = offsetY / image.offsetHeight * 100;
      zoomer = this.zoomViewer.nativeElement.children[0];
      if (zoomer) {
        zoomer.style.backgroundPosition = x + '% ' + y + '%';
        zoomer.style.display = "block";
        zoomer.style.height = image.height + 'px';
        zoomer.style.width = image.width + 'px';
      }
    }
  }

  public onMouseLeave(event) {
    this.zoomViewer.nativeElement.children[0].style.display = "none";
  }
  public openZoomViewer() {
    this.dialog.open(ProductZoomComponent, {
      data: this.zoomImage,
      panelClass: 'zoom-dialog'
    });
  }

  scroll() {
    let el = document.getElementById('description');
    el.scrollIntoView();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  public onQuestionSubmit(values: Object): void {
    if (this.questionForm.valid) {
      this.auth.getToken().subscribe(token => {
        this.adService.createAdvertisementQuestion(this.product.id, values, token).subscribe(result => {
          this.snackBar.open('¡Gracias por tu pregunta! La recibirá el vendedor y te contestará a la brevedad.', 'x', { panelClass: 'success', verticalPosition: 'bottom', duration: 6000 })
          this.questionForm.reset();
          this.getProductById(this.product.id);
        }, error => {
          this.snackBar.open(error.error.error, 'x', { panelClass: 'error', verticalPosition: 'bottom', duration: 3000 })
        })
      })
    }
  }
}
