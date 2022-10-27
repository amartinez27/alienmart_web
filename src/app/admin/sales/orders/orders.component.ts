import { Component, OnInit, ɵConsole } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { OrdersService } from 'src/app/services/orders.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  startDate = new FormControl(new Date())
  endtDate = new FormControl(new Date())
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  public orders = [];
  public notPrepared = [];
  public openOrders = [];
  public closedOrders = [];
  public page: any;
  public pageUnprepared: any;
  public pageOpen: any;
  public pageClosed: any;
  public count = 10;
  maxDate: Date;
  totalItems = 0;
  totalUnprepared = 0;
  totalOpen = 0;
  totalClosed = 0;
  selected = new FormControl(0);


  constructor(public auth: AuthService, public orderService: OrdersService, public router: Router) {
    const currentDate = new Date();
    this.maxDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
  }

  ngOnInit(): void {
    this.getSales();
  }

  getSales() {
    this.auth.getToken().subscribe(token => {
      this.orderService.getSellerOrders(token).subscribe(data => {
        this.orders = data.orders;
        this.orders.forEach(x => {
          if (x.status == 1) {
            x.statusDesc = 'No preparado';
          } else if (x.status == 2) {
            x.statusDesc = 'Abierto';
          } else {
            x.statusDesc = 'Cerrado';
          }
        });
        this.totalItems = data.totalItems;
      })
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
  }


  public onPageChanged(event) {
    switch (this.selected.value) {
      case 0: this.page = event;
        break;
      case 1: this.pageUnprepared = event;
        break;
      case 2: this.pageOpen = event;
        break;
      case 3: this.pageClosed = event;
        break;
    }
    //this.page = event;
    this.auth.getToken().subscribe(token => {
      this.orderService.getSellerOrders(token, event, this.selected.value == 0 ? null : this.selected.value).subscribe(data => {
        data.orders.forEach(x => {
          if (x.status == 1) {
            x.statusDesc = 'No preparado';
          } else if (x.status == 2) {
            x.statusDesc = 'Abierto';
          } else {
            x.statusDesc = 'Cerrado';
          }
        });
        switch (this.selected.value) {
          case 0:
            this.orders = data.orders;
          case 1:
            this.notPrepared = data.orders;
            break;
          case 2:
            this.openOrders = data.orders;
            break;
          case 3:
            this.closedOrders = data.orders;
            break;
        }
      });
    });
    window.scrollTo(0, 0);
  }

  onDateChange() {
    if (this.range.controls.end.value != null) {
      const endDay = this.range.value.end.getDate();
      const endMonth = this.range.value.end.getMonth() + 1;
      const endYear = this.range.value.end.getFullYear();
    }
  }

  viewOrder(order: any) {
    this.router.navigate(["admin/sales", order.id]);
  }

  tabChange(event) {
    this.selected.setValue(event);
    this.auth.getToken().subscribe(token => {
      this.orderService.getSellerOrders(token, 1, event).subscribe(data => {
        data.orders.forEach(x => {
          if (x.status == 1) {
            x.statusDesc = 'No preparado';
          } else if (x.status == 2) {
            x.statusDesc = 'Abierto';
          } else {
            x.statusDesc = 'Cerrado';
          }
        });

        switch (event) {
          case 1:
            this.notPrepared = data.orders;
            this.totalUnprepared = data.totalItems;
            break;
          case 2:
            this.openOrders = data.orders;
            this.totalOpen = data.totalItems;
            break;
          case 3:
            this.closedOrders = data.orders;
            this.totalClosed = data.totalItems;
            break;
        }
        this.totalItems = data.totalItems;
      })
    })
  }


}
