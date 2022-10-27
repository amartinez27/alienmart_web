import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { BannersService } from 'src/app/services/banners.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-banners-list',
  templateUrl: './banners-list.component.html',
  styleUrls: ['./banners-list.component.scss']
})
export class BannersListComponent implements OnInit {
  public shop_form: FormGroup;
  public ad_form: FormGroup;
  public promo_form: FormGroup;
  shopBanners: any = [];
  adBanners: any = [];
  promoBanners: any = [];

  constructor(public formBuilder: FormBuilder, private spinner: NgxSpinnerService, private storage: AngularFireStorage, public bannerService: BannersService,
    private auth: AuthService) { }

  ngOnInit(): void {
    this.shop_form = this.formBuilder.group({
      image: [null],
    });
    this.ad_form = this.formBuilder.group({
      image: [null],
    });
    this.promo_form = this.formBuilder.group({
      image: [null],
    });
    this.getBanners();
  }

  acceptFile(event, type) {
    let banner_id;
    switch (type) {
      case 'tienda':
        banner_id = 1;
        break;
      case 'anuncios':
        banner_id = 2;
        break;
      case 'promos':
        banner_id = 3;
        break;
    }
    const file = event.file;
    const file_name = `${file.name}_${Date.now()}`;
    const filePath = `banners/${file_name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    this.spinner.show();
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            if (url) {
              this.spinner.hide();
              let image = { file_name: file_name, url: url, bid: banner_id }
              this.createBanner(image);
            }
          });
        })
      ).subscribe(url => {
        if (url) {

        }
      })
  }

  createBanner(image: any) {
    this.auth.getToken().subscribe(token => {
      this.bannerService.createBanner(image, token).subscribe(banner => {
        window.location.reload();
      })
    })

  }

  getBanners() {
    this.bannerService.getBanners().subscribe(banners => {
      this.shopBanners = banners.filter(x => x.banner_type_id == 1)
      this.adBanners = banners.filter(x => x.banner_type_id == 2)
      this.promoBanners = banners.filter(x => x.banner_type_id == 3)
    })
  }

  increaseOrder(index, banners) {
    let data = {
      banner1: { id: banners[index].id, order: banners[index + 1].lineorder },
      banner2: { id: banners[index + 1].id, order: banners[index].lineorder }
    }
    this.auth.getToken().subscribe(token => {
      this.bannerService.updateBanners(data, token).subscribe(res => {
        this.getBanners();
      })
    })
  }

  decreaseOrder(index, banners) {
    let data = {
      banner1: { id: banners[index].id, order: banners[index - 1].lineorder },
      banner2: { id: banners[index - 1].id, order: banners[index].lineorder }
    }
    this.auth.getToken().subscribe(token => {
      this.bannerService.updateBanners(data, token).subscribe(res => {
        this.getBanners();
      })
    })
  }

  deleteBanner(file: any) {
    this.auth.getToken().subscribe(token => {
      this.bannerService.deleteBanner(file.id, token).subscribe(res => {
        const fileRef = this.storage.ref(`banners`);
        fileRef.child(file.file_name).delete();
        this.getBanners();
      })
    })
  }



}
