import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AdvertisementsService } from 'src/app/services/advertisements.service';
import { MatDialog } from '@angular/material/dialog';
import { PaymentDialogComponent } from '../payment-dialog/payment-dialog.component';

@Component({
  selector: 'app-bundles-list',
  templateUrl: './bundles-list.component.html',
  styleUrls: ['./bundles-list.component.scss']
})
export class BundlesListComponent implements OnInit {
  bundles = [];
  public page: any;
  public count = 10;
  totalItems = 0;
  constructor(private auth: AuthService, public adService: AdvertisementsService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getBundles();
  }

  getBundles() {
    this.auth.getToken().subscribe(token => {
      this.adService.getBundles(token).subscribe(data => {
        this.bundles = data;
        this.bundles.forEach(x => {
          x.estatus = 'No aprobado';
          if (x.approval_date) {
            x.expiration = new Date(x.approval_date);
            x.expiration.setDate(x.expiration.getDate() + x.duration);
            x.estatus = new Date() < x.expiration ? 'Vigente' : 'Vencido';
          }
        })
      })
    })
  }

  payment(bundle) {
    this.auth.getToken().subscribe(token => {
      this.adService.getPurchaseBundle(bundle.orderid, token).subscribe(data => {
        const dialogRef = this.dialog.open(PaymentDialogComponent, {
          data: {
            payment: data
          }
        });
      })
    })

  }

}
