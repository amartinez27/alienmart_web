import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Data, AppService } from '../../services/app.service';
import { Product } from '../../app.models';
import { WishlistService } from 'src/app/services/wishlist.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {
  public quantity: number = 1;
  public action: string = "remove";
  constructor(public appService: AppService, public snackBar: MatSnackBar,
    public wishlistService: WishlistService, public auth: AuthService) { }

  ngOnInit() {
    if (this.auth.isLoggedIn) {
      this.getUsersWishlist();
    }
  }

  public async getUsersWishlist() {
    this.auth.getToken().subscribe(token => {
      this.wishlistService.getUsersWishlist(token).subscribe(data => {
        this.appService.Data.wishList = data;
        this.appService.Data.cartList.forEach(cartProduct => {
          this.appService.Data.wishList.forEach(product => {
            if (cartProduct.id == product.id) {
              product.cart_count = cartProduct.cart_count;
            }
          });
        });
      });
    });

  }

  public remove(product: Product) {
    const index: number = this.appService.Data.wishList.indexOf(product);
    this.auth.getToken().subscribe(data => {
      this.wishlistService.deleteLike(product.id, data).subscribe(success => {
        if (index !== -1) {
          this.appService.Data.wishList.splice(index, 1);
        }
        this.snackBar.open(success.message, '×', { panelClass: 'success', verticalPosition: 'bottom', duration: 5000 });
      }, error => {
        this.snackBar.open(error.error?.error, '×', { panelClass: 'success', verticalPosition: 'bottom', duration: 5000 });
      })
    })
  }

  public clear() {
    this.auth.getToken().subscribe(token => {
      this.wishlistService.deleteUsersWishlist(token).subscribe(success => {
        this.snackBar.open(success.message, '×', { panelClass: 'success', verticalPosition: 'bottom', duration: 5000 });
        this.appService.Data.wishList = [];
      })
    })
  }

  public getQuantity(val) {
    this.quantity = val.soldQuantity;
  }

  public addToCart(product: Product) {
    let currentProduct = this.appService.Data.cartList.filter(item => item.id == product.id)[0];
    if (currentProduct) {
      if ((currentProduct.cart_count + this.quantity) <= product.availability) {
        product.cart_count = currentProduct.cart_count + this.quantity;
      }
      else {
        this.snackBar.open('You can not add more items than available. In stock ' + product.availability + ' items and you already added ' + currentProduct.cart_count + ' item to your cart', '×', { panelClass: 'error', verticalPosition: 'bottom', duration: 5000 });
        return false;
      }
    }
    else {
      product.cart_count = this.quantity;
    }
    this.appService.addToCart(product);
  }

}