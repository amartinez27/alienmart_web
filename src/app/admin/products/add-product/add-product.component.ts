import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppService } from 'src/app/services/app.service';
import { ProductService } from 'src/app/services/products.service';
import { Category } from 'src/app/app.models';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoriesService } from 'src/app/services/categories.service';
import { AuthService } from 'src/app/services/auth.service';
import { AddressService } from 'src/app/services/address.service';
import { greaterThan } from 'src/app/theme/utils/app-validators';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddProductComponent implements OnInit {
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
  product: any;

  public exposure_types: any = [
    { id: 1, name: 'Élite', description: '14% de comisión de venta' },
    { id: 2, name: 'Ultra', description: '12.5% de comisión de venta' },
    { id: 3, name: 'Pro', description: '11% de comisión de venta' }
  ]
  private sub: any;
  public id: any;
  uploadPercent: Observable<number>;
  downloadURL;
  public filesToDelete = [];

  constructor(public appService: AppService, public formBuilder: FormBuilder, private activatedRoute: ActivatedRoute,
    public prodService: ProductService, private storage: AngularFireStorage, private fireAuth: AngularFireAuth,
    public snackBar: MatSnackBar, public router: Router, public catService: CategoriesService, public auth: AuthService,
    public addressService: AddressService, public spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(100)])],
      description: ['', [Validators.required, Validators.maxLength(4000)]],
      images: [null, Validators.required],
      price: [null, Validators.required],
      comparison_price: null,
      //"discount": null,
      availability: [1, [Validators.required, Validators.min(1)]],
      sku: null,
      //"quantityTrack": false,
      //"permanentSale": false,
      category_id: [null, Validators.required],
      secondCatId: null,
      thirdCatId: null,
      fourthCatId: null,
      length: [0, [Validators.required, Validators.min(1)]],
      width: [0, [Validators.required, Validators.min(1)]],
      height: [0, [Validators.required, Validators.min(1)]],
      weight: [0, [Validators.required, Validators.min(0.1)]],
      pickup_address_id: [null, Validators.required],
      exposure_type_id: [null, Validators.required]
    });

    this.form.get('comparison_price').setValidators(greaterThan('price'));

    this.getCategories();
    this.getUsersAddresses();
    this.sub = this.activatedRoute.params.subscribe(params => {
      if (params['id']) {
        this.id = params['id'];
        this.getProductById();
      }
    });
  }

  public getCategories() {
    this.catService.getCategories().subscribe(data => {
      this.globalCatData = data;
      this.categories = data.filter(x => x.parent_id == null);
      //this.categories.shift();
    });
  }

  public getProductById() {
    this.prodService.getProductById(this.id).subscribe((data: any) => {
      this.product = data;
      this.form.patchValue(data);
      const images: any[] = [];

      let cat1, cat2, cat3, cat4;
      if (data.category_path[0]) {
        this.form.controls.category_id.setValue(data.category_path[0]);
        cat1 = data.category_path[0];
      } else {
        cat1 = data.category_id;
        this.form.controls.category_id.setValue(data.category_id);
      }
      this.secondCategories = this.globalCatData.filter(e => {
        return e.parent_id == cat1 && e.parent_id != null;
      })

      if (data.category_path[1]) {
        this.form.controls.secondCatId.setValue(data.category_path[1]);
        cat2 = data.category_path[1]
      } else {
        if (data.category_path[0]) cat2 = data.category_id;
        this.form.controls.secondCatId.setValue(data.category_id);
      }
      this.thirdCategories = this.globalCatData.filter(e => {
        return e.parent_id == cat2 && e.parent_id != null;
      })


      if (data.category_path[2]) {
        this.form.controls.thirdCatId.setValue(data.category_path[2]);
        cat3 = data.category_path[2]
      } else {
        if (data.category_path[1]) cat3 = data.category_id;
        this.form.controls.thirdCatId.setValue(data.category_id);
      }
      this.fourthCategories = this.globalCatData.filter(e => {
        return e.parent_id == cat3 && e.parent_id != null;
      })

      if (data.category_path[0] && data.category_path[1] && data.category_path[2]) {
        this.form.controls.fourthCatId.setValue(data.category_id);
      }
      data.images.forEach(item => {
        let image = { link: item.url, preview: item.url, name: item.file_name.substring(0, item.file_name.lastIndexOf('_')) }
        let file = { file_name: item.file_name, file_type: item.file_type, url: item.url, og_name: item.file_name.substring(0, item.file_name.lastIndexOf('_')) };
        images.push(image);
        this.files.push(file);
      })
      this.form.controls.images.setValue(images);
    }, error => {
      this.snackBar.open(error.error.error, 'x', { panelClass: 'error', verticalPosition: 'bottom', duration: 3000 })
      this.router.navigate(['admin/products']);
    });
  }

  public getUsersAddresses() {
    this.auth.getToken().subscribe(token => {
      this.addressService.getAddressesForUser(token).subscribe(data => {
        this.addresses = data;
      });
    });
  }

  public onSubmit(values) {

    if (!this.form.controls.comparison_price.value) {
      this.form.controls.comparison_price.clearValidators();
      this.form.controls.comparison_price.updateValueAndValidity();
    } else {
      this.form.get('comparison_price').setValidators(greaterThan('price'));
      this.form.controls.comparison_price.updateValueAndValidity();
    }
    if (this.form.valid) {
      const { name, description, availability, sku, price, comparison_price,
        height, width, length, pickup_address_id, weight, exposure_type_id } = values;
      let product = {
        name, description, price, comparison_price, availability, category_id: this.categorySelected,
        sku, images: this.files, height, length, width, pickup_address_id, weight, exposure_type_id
      };
      if (this.id) {
        const fileRef = this.storage.ref(`products`);
        this.filesToDelete.forEach(x => {
          fileRef.child(x.file_name).delete();
        })

        this.auth.getToken().subscribe(token => {
          this.prodService.updateProduct(this.product.id, product, token).subscribe(data => {
            this.snackBar.open('El producto se ha modificado exitosamente.', '×', { panelClass: 'success', verticalPosition: 'bottom', duration: 3000 });
            this.router.navigate(['admin/products']);
          }, error => {
            this.snackBar.open(error.error?.error, '×', { panelClass: 'error', verticalPosition: 'bottom', duration: 3000 });
          })
        })

      } else {
        this.auth.getToken().subscribe(token => {
          this.prodService.createProduct(product, token).subscribe(data => {
            this.snackBar.open('El producto se ha publicado exitosamente.', '×', { panelClass: 'success', verticalPosition: 'bottom', duration: 3000 });
            this.router.navigate(['admin/products']);
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

    const filePath = `products/${file_name}`;
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
      const fileRef = this.storage.ref(`products`);
      let file = this.files.find(x => x.og_name == event.file.name);
      fileRef.child(file.file_name).delete();
      this.files = this.files.filter(x => x.og_name != event.file.name);
    }
  }

  public onColorSelectionChange(event: any) {
    if (event.value) {
      this.selectedColors = event.value.join();
    }
  }

  applyCategoryFilter(event: any) {
    const catId = event.value;
    this.categorySelected = catId;
    this.thirdCategories = [];
    this.fourthCategories = [];
    this.secondCategories = this.globalCatData.filter(e => {
      return e.parent_id == catId;
    })
  }

  applySecondCategoryFilter(event: any) {
    const catId = event.value;
    this.categorySelected = catId;
    this.fourthCategories = [];
    this.thirdCategories = this.globalCatData.filter(e => {
      return e.parent_id == catId;
    })
  }

  applyThirdCategoryFilter(event: any) {
    const catId = event.value;
    this.categorySelected = catId;
    this.fourthCategories = this.globalCatData.filter(e => {
      return e.parent_id == catId;
    })
  }

  applyFourthCategoryFilter(event: any) {
    const catId = event.value;
    this.categorySelected = catId;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  back() {
    this.router.navigateByUrl('admin/products');
  }
}
