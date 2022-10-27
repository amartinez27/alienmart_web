import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersService } from 'src/app/services/users.service';
import { AppSettings } from 'src/app/app.settings';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss']
})
export class InformationComponent implements OnInit {
  public config: SwiperConfigInterface = {};
  docsForm: FormGroup;
  infoForm: FormGroup;
  generos: any;
  passwordForm: FormGroup;
  fiscalForm: FormGroup;
  userInfo: any;
  maxDate: Date;
  bank_statement_error = false;
  id_document_error = false;
  constitutive_act_error = false;
  profile_pic_error = false;

  profile_pic = { url: null, name: null };
  bank_statement = { url: null, name: null };
  id_document = { url: null, name: null };
  constitutive_act = { url: null, name: null };
  rfc = { url: null, name: null };
  downloadURL: Observable<string>;
  prev_profile_pic = [];
  prev_bank_statement = [];
  prev_id_document = [];
  prev_constitutive_act = [];
  user: any;
  sales_count = 0;
  top = 0;
  percentage = 0;


  constructor(public formBuilder: FormBuilder, public snackBar: MatSnackBar, public userService: UsersService,
    public appSettings: AppSettings, public authService: AuthService, private storage: AngularFireStorage, private spinner: NgxSpinnerService, public auth: AuthService) {
    const currentDate = new Date();
    this.maxDate = new Date(currentDate.getFullYear() - 18, currentDate.getMonth(), currentDate.getDate());
  }

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem('user'));
    this.userInfo.image_url = this.userInfo.image_url ? this.userInfo.image_url : 'https://firebasestorage.googleapis.com/v0/b/alienmart-shop.appspot.com/o/default%2Fno_image_available.jpg?alt=media&token=1d1053d4-31ac-43b3-82f8-52c2d0bf3374';
    this.getUserById(this.userInfo.id);
    this.userInfo.birth_date = new Date(this.userInfo.birth_date);
    this.userInfo.birth_date.setMinutes(this.userInfo.birth_date.getMinutes() + this.userInfo.birth_date.getTimezoneOffset());
    this.infoForm = this.formBuilder.group({
      first_name: [this.userInfo.first_name, Validators.compose([Validators.required, Validators.minLength(3)])],
      last_name: [this.userInfo.last_name, Validators.compose([Validators.required, Validators.minLength(3)])],
      email: [{ value: this.userInfo.email, disabled: true }],
      birth_date: [this.userInfo.birth_date, Validators.required],
      gender: [this.userInfo.gender, Validators.required],
      phone: [this.userInfo.phone, [Validators.required, Validators.pattern("^((\\+52-?)|0)?[0-9]{10}$"), Validators.minLength(10), Validators.maxLength(14)]]
    });

    this.fiscalForm = this.formBuilder.group({
      business_name: [this.userInfo.business_name, Validators.required],
      rfc: [this.userInfo.rfc, [Validators.required, Validators.minLength(12), Validators.maxLength(13)]],
      curp: [this.userInfo.curp, [Validators.required, Validators.minLength(18), Validators.maxLength(18)]],
      clabe: [this.userInfo.clabe, [Validators.required, Validators.minLength(18), Validators.maxLength(18)]],
      fiscal_address: [this.userInfo.fiscal_address, Validators.required]
    });

    this.docsForm = this.formBuilder.group({
      profile_pic: [null],
      bank_statement: [null],
      id_document: [null],
      constitutive_act: [null],
      rfc: [null],
    });

    this.generos = [
      { value: 1, viewValue: 'Masculino' },
      { value: 2, viewValue: 'Femenino' },
      { value: 3, viewValue: 'Otro' }
    ]
  }


  ngAfterViewInit() {
    this.config = {
      observer: false,
      slidesPerView: 3,
      spaceBetween: 20,
      keyboard: true,
      navigation: true,
      pagination: false,
      loop: false,
      effect: 'coverflow',
      coverflowEffect: {
        rotate: 20,
        slideShadows: false,
        modifier: 1.2,
        depth: 200
      }
    }
  }


  getUserById(id) {
    this.auth.getToken().subscribe(token => {
      this.userService.getUserById(id, token).subscribe(data => {
        localStorage.setItem('user', JSON.stringify(data));
        this.appSettings.currentUser = data;
        this.userInfo = data
        this.userInfo.image_url = this.userInfo.image_url ? this.userInfo.image_url : 'https://firebasestorage.googleapis.com/v0/b/alienmart-shop.appspot.com/o/default%2Fno_image_available.jpg?alt=media&token=1d1053d4-31ac-43b3-82f8-52c2d0bf3374';
        this.sales_count = parseInt(data.sales_count);
        if (this.sales_count > 0 && this.sales_count < 11) {
          this.top = 10;
        }
        if (this.sales_count > 10 && this.sales_count < 101) {
          this.top = 100;
        }
        if (this.sales_count > 100 && this.sales_count < 501) {
          this.top = 500;
        }
        if (this.sales_count > 500 && this.sales_count < 3001) {
          this.top = 3000;
        }
        this.percentage = this.sales_count * 100 / this.top;
        if (this.sales_count > 3000) {
          this.top = -1;
          this.percentage = 100;
        }
        this.user = data;
        let bank = data.files.find(x => x.file_type == 'bank_statement' && x.url != null);
        let selfie = data.files.find(x => x.file_type == 'profile_pic' && x.url != null);
        let id = data.files.find(x => x.file_type == 'id_document' && x.url != null);
        let act = data.files.find(x => x.file_type == 'constitutive_act' && x.url != null);
        let rfc = data.files.find(x => x.file_type == 'rfc' && x.url != null);
        if (selfie) {
          this.profile_pic.url = selfie.url;
          this.profile_pic.name = selfie.name;
          this.docsForm.controls.profile_pic.setValue([{ link: selfie.url, preview: selfie.url, name: selfie.name, type: selfie.extension }]);
        }
        if (bank) {
          this.bank_statement.url = bank.url;
          this.bank_statement.name = bank.name;
          this.docsForm.controls.bank_statement.setValue([{ link: bank.url, file: { name: bank.name, type: bank.extension } }]);
        }
        if (id) {
          this.id_document.url = id.url;
          this.id_document.name = id.name;
          this.docsForm.controls.id_document.setValue([{ link: id.url, file: { name: id.name, type: id.extension } }]);
        }
        if (act) {
          this.constitutive_act.url = act.url;
          this.constitutive_act.name = act.name;
          this.docsForm.controls.constitutive_act.setValue([{ link: act.url, file: { name: act.name, type: act.extension } }]);
        }
        if (rfc) {
          this.rfc.url = act.url;
          this.rfc.name = act.name;
          this.docsForm.controls.rfc.setValue([{ link: rfc.url, file: { name: rfc.name, type: rfc.extension } }]);
        }
      })
    })
  }

  public onInfoFormSubmit(values: any) {
    if (this.infoForm.valid) {
      values.birth_date = this.userService.formatDate(values.birth_date);
      this.authService.getToken().subscribe(token => {
        this.userService.updateUser(this.userInfo.id, values, token).subscribe(updatedUser => {
          this.appSettings.currentUser = updatedUser;
          localStorage.setItem('user', JSON.stringify(updatedUser));
          this.snackBar.open('Sus datos personales se han actualizado.', '×', { panelClass: 'success', verticalPosition: 'bottom', duration: 3000 });
        }, error => {
          this.snackBar.open(error.error.error, '×', { panelClass: 'error', verticalPosition: 'bottom', duration: 3000 });
        })
      })
    }
  }

  public onFiscalFormSubmit(values): void {
    if (this.fiscalForm.valid) {
      const { business_name, clabe, curp, fiscal_address, rfc } = values;

      let newInfo = { business_name, clabe, curp, fiscal_address, rfc };
      this.bank_statement_error = this.id_document_error = this.constitutive_act_error = this.profile_pic_error = false;
      this.authService.getToken().subscribe(token => {
        this.userService.updateUser(this.userInfo.id, newInfo, token).subscribe(updatedUser => {
          this.appSettings.currentUser = updatedUser;
          localStorage.setItem('user', JSON.stringify(updatedUser));
          this.snackBar.open('Su información fiscal se ha actualizado.', '×', { panelClass: 'success', verticalPosition: 'bottom', duration: 3000 });
        }, error => {
          this.snackBar.open(error.error?.error, '×', { panelClass: 'error', verticalPosition: 'bottom', duration: 3000 });
        })
      })
    }
  }

  acceptFile(event, type) {
    const file = event.file;
    const file_name = `${file.name}_${Date.now()}`;
    const filePath = `user_files/${file_name}`;
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
              this.auth.getToken().subscribe(token => {
                this.userService.updateUserFile(type, { url, name: file_name, extension: file.type }, token).subscribe(data => {
                  if (type == 'profile_pic') {
                    this.profile_pic.url = url;
                  }
                  if (type == 'bank_statement') {
                    this.bank_statement.url = url;
                  }
                  if (type == 'id_document') {
                    this.id_document.url = url;
                  }
                  if (type == 'constitutive_act') {
                    this.constitutive_act.url = url;
                  }
                  if (type == 'rfc') {
                    this.rfc.url = url;
                  }
                  this.snackBar.open(`El archivo ${type.toUpperCase()} se subió de manera correcta`, 'x', { panelClass: 'success', verticalPosition: 'bottom', duration: 3000 })
                  this.getUserById(this.userInfo.id);

                }, error => {
                  this.snackBar.open(error.error.error, 'x', { panelClass: 'error', verticalPosition: 'bottom', duration: 3000 })
                })
              })
            }
          });
        })
      ).subscribe(url => {
        if (url) {

        }
      })

  }


  deletedFile(event, type) {
    if (type == 'profile_pic') {
      this.docsForm.controls.profile_pic.reset();
      const fileRef = this.storage.refFromURL(this.profile_pic.url).delete();
    }
    if (type == 'bank_statement') {
      this.docsForm.controls.bank_statement.reset();
      const fileRef = this.storage.refFromURL(this.bank_statement.url).delete();
    }
    if (type == 'id_document') {
      this.docsForm.controls.id_document.reset();
      const fileRef = this.storage.refFromURL(this.id_document.url).delete();
    }
    if (type == 'constitutive_act') {
      this.docsForm.controls.constitutive_act.reset();
      const fileRef = this.storage.refFromURL(this.constitutive_act.url).delete();
    }
    if (type == 'rfc') {
      this.docsForm.controls.rfc.reset();
      const fileRef = this.storage.refFromURL(this.rfc.url).delete();
    }
    this.auth.getToken().subscribe(token => {
      this.userService.updateUserFile(type, { url: null, name: null, extension: null }, token).subscribe(data => {
        this.snackBar.open(`El documento ${type.toUpperCase()} se ha eliminado`, 'x', { panelClass: 'success', verticalPosition: 'bottom', duration: 3000 })
        this.getUserById(this.userInfo.id);
      }, error => {
        this.snackBar.open(error.error.error, 'x', { panelClass: 'error', verticalPosition: 'bottom', duration: 3000 })
      })
    })
  }

}
