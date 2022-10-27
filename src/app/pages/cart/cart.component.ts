import { Component, OnInit } from '@angular/core';
import { Data, AppService } from '../../services/app.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  total = [];
  grandTotal = 0;
  cartItemCount = [];
  cartItemCountTotal = 0;
  constructor(public appService: AppService) { }

  ngOnInit() {
    this.appService.Data.cartList.forEach(product => {
      this.total[product.id] = product.cart_count * product.price;
      this.grandTotal += product.cart_count * product.price;
      this.cartItemCount[product.id] = product.cart_count;
      this.cartItemCountTotal += product.cart_count;
    })
  }

  public updateCart(value) {
    if (value) {
      this.total[value.productId] = value.total;
      this.cartItemCount[value.productId] = value.soldQuantity;
      this.grandTotal = 0;
      this.total.forEach(price => {
        this.grandTotal += price;
      });
      this.cartItemCountTotal = 0;
      this.cartItemCount.forEach(count => {
        this.cartItemCountTotal += count;
      });

      this.appService.Data.totalPrice = this.grandTotal;
      this.appService.Data.totalcart_count = this.cartItemCountTotal;

      this.appService.Data.cartList.forEach(product => {
        this.cartItemCount.forEach((count, index) => {
          if (product.id == index) {
            product.cart_count = count;
          }
        });
      });

    }
  }

  public remove(product) {
    const index: number = this.appService.Data.cartList.indexOf(product);
    if (index !== -1) {
      this.appService.Data.cartList.splice(index, 1);
      this.grandTotal = this.grandTotal - this.total[product.id];
      this.appService.Data.totalPrice = this.grandTotal;
      this.total.forEach(val => {
        if (val == this.total[product.id]) {
          this.total[product.id] = 0;
        }
      });

      this.cartItemCountTotal = this.cartItemCountTotal - this.cartItemCount[product.id];
      this.appService.Data.totalcart_count = this.cartItemCountTotal;
      this.cartItemCount.forEach(val => {
        if (val == this.cartItemCount[product.id]) {
          this.cartItemCount[product.id] = 0;
        }
      });
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

}
