import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CategoriesService } from 'src/app/services/categories.service';
import { FeaturedTypesService } from 'src/app/services/featured-types.service';
import { MatStepper } from '@angular/material/stepper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';
import { AdvertisementsService } from 'src/app/services/advertisements.service';
declare var Conekta: any;

@Component({
  selector: 'app-advertisement-bundle',
  templateUrl: './advertisement-bundle.component.html',
  styleUrls: ['./advertisement-bundle.component.scss']
})
export class AdvertisementBundleComponent implements OnInit {

  categorySelectGroup: FormGroup;
  bundleSelectGroup: FormGroup;
  paymentForm: FormGroup;
  categories = [];
  category: any;
  selectedBundle: any;
  bundles = [];
  payment_types = [];
  appliedBundles = [];
  payment_type = 'card';
  cardType = '';
  months = [];
  years = [];
  payment_label = '';
  digits = '';

  constructor(private _formBuilder: FormBuilder, public categoryService: CategoriesService, public adBundleService: FeaturedTypesService,
    public snackBar: MatSnackBar, public appService: AppService, public auth: AuthService, public adService: AdvertisementsService) {
    this.categorySelectGroup = this._formBuilder.group({});
    this.bundleSelectGroup = this._formBuilder.group({});
    this.paymentForm = this._formBuilder.group({});
  }

  ngOnInit(): void {
    this.getCategories();
    this.getBundles();
    this.months = this.appService.getMonths();
    this.years = this.appService.getYears();
    this.paymentForm = this._formBuilder.group({
      payment_type: [this.payment_type, Validators.required],
      cardHolderName: ['', Validators.required],
      cardNumber: ['', Validators.required],
      expiredMonth: ['', Validators.required],
      expiredYear: ['', Validators.required],
      cvv: ['', Validators.required]
    });

    this.payment_types = [
      { id: 'card', description: 'Tarjeta de crédito/débito' },
      { id: 'oxxo_cash', description: 'Pago en OXXO' },
      { id: 'spei', description: 'SPEI' },
      { id: 'paynet', description: 'Pago en 7-Eleven, Walmart, Farmacias Benavides, Farmacias del Ahorro, Superama, Bodega Aurrera, Sam\'s Club' }
    ]
  }

  getCategories() {
    this.categoryService.getAdCategories().subscribe(data => {
      this.categories = data.filter(x => x.parent_id == null);
    })
  }

  getBundles() {
    this.adBundleService.getFeaturedBundles().subscribe(data => {
      this.bundles = data;
    })
  }

  selectCategory(stepper, category: any) {
    stepper.next();
    this.category = category;
    this.appliedBundles = this.category.bundles;
  }

  selectBundle(stepper, bundle: any) {
    stepper.next();
    this.selectedBundle = bundle;
  }

  validatePaymentData(stepper: MatStepper) {
    if (this.paymentForm.controls.payment_type.value != 'card') {
      this.paymentForm.controls.cardHolderName.clearValidators();
      this.paymentForm.controls.cardNumber.clearValidators();
      this.paymentForm.controls.expiredMonth.clearValidators();
      this.paymentForm.controls.expiredYear.clearValidators();
      this.paymentForm.controls.cvv.clearValidators();

      this.paymentForm.controls.cardHolderName.updateValueAndValidity();
      this.paymentForm.controls.cardNumber.updateValueAndValidity();
      this.paymentForm.controls.expiredMonth.updateValueAndValidity();
      this.paymentForm.controls.expiredYear.updateValueAndValidity();
      this.paymentForm.controls.cvv.updateValueAndValidity();
      stepper.next();
    } else {
      if (Conekta.card.validateNumber(this.paymentForm.controls.cardNumber.value)
        && Conekta.card.validateExpirationDate(this.paymentForm.controls.expiredMonth.value, this.paymentForm.controls.expiredYear.value)
        && Conekta.card.validateCVC(this.paymentForm.controls.cvv.value)) {
        this.cardType = Conekta.card.getBrand(this.paymentForm.controls.cardNumber.value);
        this.digits = this.paymentForm.controls.cardNumber.value.toString();
        this.digits = this.digits.substring(this.digits.length - 4)
        stepper.next();
      } else {
        this.snackBar.open('Sus datos bancarios no han podido ser comprobados. Verifique su información y vuelva a intentar.', '×', { panelClass: 'error', verticalPosition: 'bottom', duration: 3000 });
      }
    }
    this.payment_label = this.payment_types.find(x => x.id == this.paymentForm.controls.payment_type.value).description
  }

  public async placeOrder(stepper: MatStepper) {
    let data = {
      bundle: this.selectedBundle,
      total: this.selectedBundle.price,
      payment_type: this.paymentForm.controls.payment_type.value
    }
    if (this.paymentForm.controls.payment_type.value == 'card') {
      const result = await this.cardPayment({
        card: {
          number: this.paymentForm.controls.cardNumber.value,
          name: this.paymentForm.controls.cardHolderName.value,
          exp_year: this.paymentForm.controls.expiredYear.value,
          exp_month: this.paymentForm.controls.expiredMonth.value,
          cvc: this.paymentForm.controls.cvv.value
        }
      });
      data['payment_token'] = result['id'];
    }

    this.auth.getToken().subscribe(token => {
      this.adService.purchaseAdBundle(data, token).subscribe(payment => {
        stepper._steps.forEach(step => step.editable = false);
        stepper.next();
      }, error => {
      })
    })
  }

  cardPayment(card: any) {
    return new Promise(function (resolve, reject) {
      Conekta.Token.create(card, function (token) {
        resolve(token)
      }, function (error) {
        reject(error);
      })
    })
  }

}
