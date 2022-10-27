import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Data, AppService } from '../../services/app.service';
import { AuthService } from 'src/app/services/auth.service';
import { AddressService } from 'src/app/services/address.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrdersService } from 'src/app/services/orders.service';
import { Router } from '@angular/router';
declare var Conekta: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  @ViewChild('horizontalStepper', { static: true }) horizontalStepper: MatStepper;
  @ViewChild('verticalStepper', { static: true }) verticalStepper: MatStepper;
  billingForm: FormGroup;
  deliveryForm: FormGroup;
  paymentForm: FormGroup;
  countries = [];
  months = [];
  years = [];
  deliveryMethods = [];
  payment_types = [];
  payment_type = 'spei';
  grandTotal = 0;
  cardType = '';
  payment_label = '';
  digits = '';
  order = '';

  public addresses: any = [];

  constructor(public appService: AppService, public formBuilder: FormBuilder, public auth: AuthService,
    public addressService: AddressService, public snackBar: MatSnackBar, public orderService: OrdersService,
    public router: Router) { }

  ngOnInit() {
    if (this.auth.isLoggedIn) {
      this.getUsersAddresses();
      this.appService.Data.cartList.forEach(product => {
        this.grandTotal += product.cart_count * product.price;
      });
      this.countries = this.appService.getCountries();
      this.months = this.appService.getMonths();
      this.years = this.appService.getYears();
      this.deliveryMethods = this.appService.getDeliveryMethods();
      this.billingForm = this.formBuilder.group({
        address: [null, Validators.required]
      });
      this.deliveryForm = this.formBuilder.group({
        deliveryMethod: [this.deliveryMethods[0], Validators.required]
      });
      this.paymentForm = this.formBuilder.group({
        payment_type: [this.payment_type, Validators.required],
        cardHolderName: ['', Validators.required],
        cardNumber: ['', Validators.required],
        expiredMonth: ['', Validators.required],
        expiredYear: ['', Validators.required],
        cvv: ['', Validators.required]
      });

      this.payment_types = [
        { id: 'spei', description: 'SPEI' },
        { id: 'paynet', description: 'Pago en 7-Eleven, Walmart, Farmacias Benavides, Farmacias del Ahorro, Superama, Bodega Aurrera, Sam\'s Club' },
        { id: 'card', description: 'Tarjeta de crédito/débito' },
        { id: 'oxxo_cash', description: 'Pago en OXXO' }

      ]

      if (this.grandTotal >= 2500) this.payment_types = this.payment_types.filter(x => x.id != 'card')
      if (this.grandTotal >= 10000) this.payment_types = this.payment_types.filter(x => x.id != 'oxxo_cash')
    } else {
      this.snackBar.open('Inicie sesión para poder realizar el checkout', 'x', { verticalPosition: 'bottom', duration: 4000 })
      this.router.navigate(['/sign-in']);
    }
  }

  public async placeOrder(stepper: MatStepper) {
    let data = {
      products: this.appService.Data.cartList.map(({ cart_count, id }) => ({ quantity: cart_count, product_id: id })),
      total: this.grandTotal,
      address_id: this.billingForm.controls.address.value,
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
      this.orderService.createOrder(data, token).subscribe(payment => {
        this.horizontalStepper._steps.forEach(step => step.editable = false);
        this.verticalStepper._steps.forEach(step => step.editable = false);
        this.appService.Data.cartList.length = 0;
        this.appService.Data.totalPrice = 0;
        this.appService.Data.totalcart_count = 0;
        this.order = payment.id;
        stepper.next();
      }, error => {
        this.snackBar.open(error.error.error, 'x', { panelClass: 'error', verticalPosition: 'bottom', duration: 3000 })
      })
    })



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

  public getUsersAddresses() {
    this.auth.getToken().subscribe(token => {
      this.addressService.getAddressesForUser(token).subscribe(data => {
        this.addresses = data;
      });
    });
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
