import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Data, AppService } from '../../services/app.service';
import { Product } from '../../app.models';
import { AuthService } from 'src/app/services/auth.service';
import { WishlistService } from 'src/app/services/wishlist.service';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent implements OnInit {
  @Input() product: any;
  @Input() type: string;
  @Output() onOpenProductDialog: EventEmitter<any> = new EventEmitter();
  @Output() onQuantityChange: EventEmitter<any> = new EventEmitter<any>();
  public count: number = 1;
  public align = 'center center';
  constructor(public appService: AppService, public snackBar: MatSnackBar,
    public auth: AuthService, public wishlistService: WishlistService) { }

  ngOnInit() {
    if (this.product) {
      if (this.product.cart_count > 0) {
        this.count = this.product.cart_count;
      }
    }
    this.layoutAlign();
  }

  public layoutAlign() {
    if (this.type == 'all') {
      this.align = 'space-between center';
    }
    else if (this.type == 'wish') {
      this.align = 'start center';
    }
    else {
      this.align = 'center center';
    }
  }



  public increment(count) {
    if (this.count < this.product.availability) {
      this.count++;
      let obj = {
        productId: this.product.id,
        soldQuantity: this.count,
        total: this.count * this.product.price
      }
      this.changeQuantity(obj);
    }
    else {
      this.snackBar.open('El vendedor ha limitado la venta de este artículo.', '×', { panelClass: 'error', verticalPosition: 'bottom', duration: 3000 });
    }
  }

  public decrement(count) {
    if (this.count > 1) {
      this.count--;
      let obj = {
        productId: this.product.id,
        soldQuantity: this.count,
        total: this.count * this.product.price
      }
      this.changeQuantity(obj);
    }
  }

  public addToCompare(product: Product) {
    this.appService.addToCompare(product);
  }

  public addToWishList(product: Product) {
    if (this.auth.isLoggedIn) {
      this.appService.addToWishList(product);
    } else {
      this.snackBar.open('Regístrese o inicie sesión para agregar a sus favoritos.', 'x', { verticalPosition: 'bottom', duration: 4000 })
    }
  }

  public removeFromWishlist(product) {
    //const index: number = this.appService.Data.wishList.map(x => { return x.id }).indexOf(product.id);
    let isAdvertisement = product.featured_type_id;
    const index: number = this.appService.Data.wishList.findIndex(x => x.id == product.id && x.featured_type_id == isAdvertisement)
    this.auth.getToken().subscribe(data => {
      if (product.featured_type_id) {
        this.wishlistService.deleteAdLike(product.id, data).subscribe(success => {
          if (index !== -1) {
            this.appService.Data.wishList.splice(index, 1);
          }
          product.liked = false;
          product.likes--;
          this.snackBar.open(success.message, '×', { panelClass: 'success', verticalPosition: 'bottom', duration: 5000 });
        }, error => {
          this.snackBar.open(error.error?.error, '×', { panelClass: 'success', verticalPosition: 'bottom', duration: 5000 });
        })
      } else {
        this.wishlistService.deleteLike(product.id, data).subscribe(success => {
          if (index !== -1) {
            this.appService.Data.wishList.splice(index, 1);
          }
          product.liked = false;
          product.likes--;
          this.snackBar.open(success.message, '×', { panelClass: 'success', verticalPosition: 'bottom', duration: 5000 });
        }, error => {
          this.snackBar.open(error.error?.error, '×', { panelClass: 'success', verticalPosition: 'bottom', duration: 5000 });
        })
      }
    })
  }

  public addToCart(product: any) {
    let currentProduct = this.appService.Data.cartList.filter(item => item.id == product.id)[0];
    if (currentProduct) {
      if ((currentProduct.cart_count + this.count) <= this.product.availability) {
        product.cart_count = currentProduct.cart_count + this.count;
      }
      else {
        this.snackBar.open('En existencia ' + this.product.availability + ' y usted ha agregado ' + currentProduct.cart_count + ' a su carrito', '×', { panelClass: 'error', verticalPosition: 'bottom', duration: 5000 });
        return false;
      }
    }
    else {
      product.cart_count = this.count;
    }
    if (this.auth.isLoggedIn) {
      this.appService.addToCart(product);
    } else {
      this.snackBar.open('Regístrese o inicie sesión para agregar al carrito.', 'x', { verticalPosition: 'bottom', duration: 4000 })
    }
  }

  public openProductDialog(event) {
    this.onOpenProductDialog.emit(event);
  }

  public changeQuantity(value) {
    this.onQuantityChange.emit(value);
  }

}