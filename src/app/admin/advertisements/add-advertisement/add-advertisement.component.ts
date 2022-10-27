import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';
import { AdvertisementsService } from 'src/app/services/advertisements.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoriesService } from 'src/app/services/categories.service';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';
import { Category } from 'src/app/app.models';
import { AddressService } from 'src/app/services/address.service';
import { finalize } from 'rxjs/operators';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-advertisement',
  templateUrl: './add-advertisement.component.html',
  styleUrls: ['./add-advertisement.component.scss']
})
export class AddAdvertisementComponent implements OnInit {
  public form: FormGroup;
  public selectedColors: string;
  public globalCatData: Category[] = [];
  public categories: Category[] = [];
  public secondCategories: Category[] = [];
  public thirdCategories: Category[] = [];
  public fourthCategories: Category[] = [];
  public categorySelected: number;
  private files: any[] = [];
  public addresses: any = [];
  private sub: any;
  public filesToDelete = [];
  public id: any;
  userInfo: any;
  countries = [];
  uploadPercent: Observable<number>;
  downloadURL;
  bundles = [];
  advertisement: any;
  allbundles = [];
  constructor(public appService: AppService, public formBuilder: FormBuilder, private activatedRoute: ActivatedRoute,
    public adService: AdvertisementsService, private storage: AngularFireStorage, private fireAuth: AngularFireAuth,
    public snackBar: MatSnackBar, public router: Router, public catService: CategoriesService, public auth: AuthService,
    public addrService: AddressService, public dialog: MatDialog, public spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem('user'));
    this.getCountries();
    this.getCategories();
    this.form = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(100)])],
      description: ['', [Validators.required, Validators.maxLength(4000)]],
      images: [null, Validators.required],
      price: [null, [Validators.required, Validators.max(300000000)]],
      city: [null, [Validators.required, Validators.maxLength(64)]],
      state_id: ['', Validators.required],
      country_id: ['', Validators.required],
      featured_type_id: [null, Validators.required],
      featured_order_id: [null, Validators.required],
      subSubCatId: null,
      subCatId: null
    });
    if (this.userInfo.roles.includes("admin")) {
      this.form.controls.featured_order_id.clearValidators();
      this.form.controls.featured_order_id.updateValueAndValidity();
    }

    this.sub = this.activatedRoute.params.subscribe(params => {
      if (params['id']) {
        this.id = params['id'];
        this.getAdvertisementById();
      }
    });

    if (!this.id) this.getBundles();
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
        this.allbundles = Object.assign(this.allbundles, data);
        if (this.advertisement) {
          this.bundles = this.bundles.filter(x => (x.estatus == 'Vigente' && x.available == true) || x.orderid == this.advertisement.featured_order_id);
          this.form.patchValue(this.advertisement);
          const images: any[] = [];
          this.advertisement.images.forEach(item => {
            let image = { link: item.url, preview: item.url, name: item.file_name.substring(0, item.file_name.lastIndexOf('_')) }
            let file = { file_name: item.file_name, file_type: item.file_type, url: item.url, og_name: item.file_name.substring(0, item.file_name.lastIndexOf('_')) };
            images.push(image);
            this.files.push(file);
          })
          this.form.controls.images.setValue(images);
        } else {
          this.bundles = this.bundles.filter(x => x.estatus == 'Vigente' && x.available == true);
        }
        if (this.bundles.length == 0 && !this.userInfo.roles.includes("admin")) {
          const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            maxWidth: "400px",
            data: {
              title: "Paquetes no disponibles",
              message: "Para poder publicar un anuncio, require adquirir el paquete de anuncios que mejor se acomode a sus necesidades.",
              cancel: 'Regresar',
              accept: 'Ver paquetes'
            },
          });
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.router.navigateByUrl('/admin/advertisements/ad-bundle');
            } else {
              this.router.navigateByUrl('/admin/advertisements/advertisement-list');
            }
          })
        }
      })
    })
  }

  getAdvertisementById() {
    this.adService.getAdvertisementById(this.id).subscribe((data: any) => {
      this.advertisement = data;
      this.getBundles();
    }, error => {
      this.snackBar.open(error.error.error, 'x', { panelClass: 'error', verticalPosition: 'bottom', duration: 3000 })
      this.router.navigate(['admin/advertisements']);
    });
  }

  changeBundle(event) {
    let bundle = this.bundles.find(x => x.orderid == event.value);
    this.form.controls.featured_type_id.setValue(bundle.category_id);
    this.form.controls.featured_type_id.updateValueAndValidity();
  }


  public getCountries() {
    this.addrService.getCountries().subscribe(data => {
      this.countries = data;
    })
  }

  public getCategories() {
    this.catService.getAdCategories().subscribe(data => {
      this.globalCatData = data;
      this.categories = data.filter(x => x.parent_id == null);
    });
  }

  public onSubmit(values) {
    if (this.form.valid) {
      const { name, description, price, city, state_id, country_id, featured_type_id, featured_order_id } = values;
      let ad = {
        name, description, price, city, state_id, country_id, featured_type_id, featured_order_id, images: this.files,
      };
      if (this.id) {
        const fileRef = this.storage.ref(`advertisements`);
        this.filesToDelete.forEach(x => {
          fileRef.child(x.file_name).delete();
        })

        this.auth.getToken().subscribe(token => {
          this.adService.updateAdvertisement(this.advertisement.id, ad, token).subscribe(data => {
            this.snackBar.open('El anuncio se ha modificado exitosamente.', '×', { panelClass: 'success', verticalPosition: 'bottom', duration: 3000 });
            this.router.navigate(['admin/advertisements']);
          }, error => {
            this.snackBar.open(error.error?.error, '×', { panelClass: 'error', verticalPosition: 'bottom', duration: 3000 });
          })
        })

      } else {
        this.auth.getToken().subscribe(token => {
          this.adService.createAdvertisement(ad, token).subscribe(data => {
            this.snackBar.open('El anuncio se ha publicado exitosamente.', '×', { panelClass: 'success', verticalPosition: 'bottom', duration: 3000 });
            this.router.navigate(['admin/advertisements']);
          }, error => {
            this.snackBar.open(error.error?.error, '×', { panelClass: 'error', verticalPosition: 'bottom', duration: 3000 });
          })
        })
      }
    }
  }

  acceptFile(event) {
    const file = event.file;
    //let imgObj = { file_name: file.name, file_type: file.type, url: null };
    const file_name = `${file.name}_${Date.now()}`;
    let imgObj = { file_name: file_name, file_type: file.type, url: null, og_name: file.name };

    const filePath = `advertisements/${file_name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    this.spinner.show();
    task.snapshotChanges().pipe(finalize(() => {
      fileRef.getDownloadURL().subscribe(url => {
        if (url) {
          this.spinner.hide();
          imgObj.url = url;
          this.files.push(imgObj);
        }
      });
    })
    ).subscribe()
  }


  deletedFile(event) {
    if (this.id) {
      if (event.file) {
        this.filesToDelete.push(this.files.find(x => event.file.name == x.og_name));
        this.files = this.files.filter(x => x.og_name != event.file.name);
      } else {
        this.filesToDelete.push(this.files.find(x => x.og_name == event.name));
        this.files = this.files.filter(x => x.og_name != event.name);
      }
    } else {
      const fileRef = this.storage.ref(`advertisements`);
      let file = this.files.find(x => x.og_name == event.file.name);
      fileRef.child(file.file_name).delete();
      this.files = this.files.filter(x => x.og_name != event.file.name);
    }
  }

  applyCategoryFilter(event) {

  }



}
