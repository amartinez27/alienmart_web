import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  orders = [];
  constructor(public auth: AuthService, public ordersService: OrdersService) { }

  ngOnInit() {
    this.getUsersOrders();
  }

  public async getUsersOrders() {
    this.auth.getToken().subscribe(token => {
      this.ordersService.getUserOrders(token).subscribe(data => {
        data.forEach(x => {
          if (x.status == 1) {
            x.statusDesc = 'No preparado';
          } else if (x.status == 2) {
            x.statusDesc = 'Abierto';
          } else {
            x.statusDesc = 'Cerrado';
          }
        });
        this.orders = data;

      });
    });

  }

  getDetail(id: number) {
    this.auth.getToken().subscribe(token => {
      this.ordersService.getOrderById(id, token).subscribe(data => {
      })
    })
  }
}
