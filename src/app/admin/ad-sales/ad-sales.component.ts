import { Component, OnInit } from '@angular/core';
import { AdvertisementsService } from 'src/app/services/advertisements.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-ad-sales',
  templateUrl: './ad-sales.component.html',
  styleUrls: ['./ad-sales.component.scss']
})
export class AdSalesComponent implements OnInit {

  bundles = [];
  public page: any;
  totalItems = 0;
  public count = 10;

  constructor(public adService: AdvertisementsService, public auth: AuthService) { }

  ngOnInit(): void {
    this.getBundles();
  }

  getBundles() {
    this.auth.getToken().subscribe(token => {
      this.adService.getBundlesForAdmin(token).subscribe(data => {
        this.bundles = data.bundles;
        this.totalItems = data.totalItems;
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

  public onPageChanged(event) {
    this.page = event;

    this.auth.getToken().subscribe(token => {
      this.adService.getBundlesForAdmin(token, event).subscribe(data => {
        this.bundles = data.bundles;
        this.totalItems = data.totalItems;
        this.bundles.forEach(x => {
          x.estatus = 'No aprobado';
          if (x.approval_date) {
            x.expiration = new Date(x.approval_date);
            x.expiration.setDate(x.expiration.getDate() + x.duration);
            x.estatus = new Date() < x.expiration ? 'Vigente' : 'Vencido';
          }
        })
      });
    });
    window.scrollTo(0, 0);
  }

}
