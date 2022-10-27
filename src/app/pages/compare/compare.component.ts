import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Data, AppService } from '../../services/app.service';
import { Product } from '../../app.models';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.scss']
})
export class CompareComponent implements OnInit {

  constructor(public appService: AppService, public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.appService.Data.cartList.forEach(cartProduct => {
      this.appService.Data.compareList.forEach(product => {
        if (cartProduct.id == product.id) {
          product.cart_count = cartProduct.cart_count;
        }
      });
    });
  }

  public remove(product: Product) {
    const index: number = this.appService.Data.compareList.indexOf(product);
    if (index !== -1) {
      this.appService.Data.compareList.splice(index, 1);
    }
  }

  public clear() {
    this.appService.Data.compareList.length = 0;
  }

  public addToCart(product: Product) {
    product.cart_count = product.cart_count + 1;
    if (product.cart_count <= product.availability) {
      this.appService.addToCart(product);
    }
    else {
      product.cart_count = product.availability;
      this.snackBar.open('You can not add more items than available. In stock ' + product.availability + ' items and you already added ' + product.cart_count + ' item to your cart', '×', { panelClass: 'error', verticalPosition: 'bottom', duration: 5000 });
    }
  }

}
