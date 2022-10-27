import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { OrdersService } from 'src/app/services/orders.service';
//import { OrderIssueDialogComponent } from '../order-issue-dialog/order-issue-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { OrderIssueDialogComponent } from '../order-issue-dialog/order-issue-dialog.component';
@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
  isVisible = false;
  private sub: any;
  total = [];
  order: any;
  constructor(private activatedRoute: ActivatedRoute, public auth: AuthService, public orderService: OrdersService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.sub = this.activatedRoute.params.subscribe(params => {
      this.getOrderById(params['id']);
    });
  }

  getOrderById(id) {
    this.auth.getToken().subscribe(token => {
      this.orderService.getOrderById(id, token).subscribe(data => {
        this.order = data;
        data.order_items.forEach(element => {
          this.total[element.id] = element.quantity * element.price;
        });
      })
    })

  }

  public openIssueDialog(data: any) {
    const dialogRef = this.dialog.open(OrderIssueDialogComponent, {
      data: {
        order: data
      },
      width: '50vw',
      height: '60vh',
      panelClass: 'issue-dialog',
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  getDecimals(number) {
    let parts = number.toString().split('.')
    if (parts[1]) return parts[1];
    return '00';
  }

}
