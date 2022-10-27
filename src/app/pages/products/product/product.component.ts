import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SwiperConfigInterface, SwiperDirective } from 'ngx-swiper-wrapper';
import { Data, AppService } from '../../../services/app.service';
import { Product } from "../../../app.models";
import { emailValidator } from '../../../theme/utils/app-validators';
import { ProductZoomComponent } from './product-zoom/product-zoom.component';
import { ProductService } from 'src/app/services/products.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
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
  public relatedProducts: Array<Product>;

  constructor(public appService: AppService, private activatedRoute: ActivatedRoute,
    public dialog: MatDialog, public formBuilder: FormBuilder,
    public prodService: ProductService, public auth: AuthService, public snackBar: MatSnackBar, public router: Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
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

  public getProductById(id) {

    if (this.auth.isLoggedIn) {
      this.auth.getToken().subscribe(token => {
        this.prodService.getProductByIdForLoggedUser(id, token).subscribe(prod => {
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
      this.prodService.getProductById(id).subscribe(prod => {
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
      this.prodService.getProductsForLoggedUser(1, 10, token, null, id).subscribe(data => {
        this.relatedProducts = data.items;
      })
    } else {
      this.prodService.getProducts(1, 10, null, id).subscribe(data => {
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

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  public setRating(rating) {
    this.rating = rating;
    this.ratingError = false;
  }

  public onSubmit(values: Object): void {
    if (this.form.valid) {
      if (this.rating < 0) {
        this.ratingError = true;
      } else {
        this.auth.getToken().subscribe(token => {
          this.prodService.createProductRating(this.product.id, { rating: this.rating, comment: values['review'] }, token).subscribe(result => {
            this.snackBar.open('¡Gracias por tu reseña! Será visible para otros compradores', 'x', { panelClass: 'success', verticalPosition: 'bottom', duration: 6000 })
            this.form.reset();
            this.getProductById(this.product.id);
          }, error => {
            this.snackBar.open(error.error.error, 'x', { panelClass: 'error', verticalPosition: 'bottom', duration: 3000 })
          })
        })
      }
    }
  }

  public onQuestionSubmit(values: Object): void {
    if (this.questionForm.valid) {
      this.auth.getToken().subscribe(token => {
        this.prodService.createProductQuestion(this.product.id, values, token).subscribe(result => {
          this.snackBar.open('¡Gracias por tu pregunta! La recibirá el vendedor y te contestará a la brevedad.', 'x', { panelClass: 'success', verticalPosition: 'bottom', duration: 6000 })
          this.questionForm.reset();
          this.getProductById(this.product.id);
        }, error => {
          this.snackBar.open(error.error.error, 'x', { panelClass: 'error', verticalPosition: 'bottom', duration: 3000 })
        })
      })
    }
  }

  getSentiment(rating: number) {
    let sentiment = '';
    switch (true) {
      case rating >= 0 && rating < 20: {
        sentiment = 'sentiment_very_dissatisfied';
        break;
      }
      case rating >= 20 && rating < 40: {
        sentiment = 'sentiment_dissatisfied';
        break;
      }
      case rating >= 40 && rating < 60: {
        sentiment = 'sentiment_neutral';
        break;
      }
      case rating >= 60 && rating < 80: {
        sentiment = 'sentiment_satisfied';
        break;
      }
      case rating >= 80 && rating <= 100: {
        sentiment = 'sentiment_very_satisfied';
        break;
      }
      default: {
        sentiment = 'sentiment_very_satisfied';
        break;
      }
    }
    return sentiment;
  }

  scroll() {
    let el = document.getElementById('description');
    el.scrollIntoView();
  }
}