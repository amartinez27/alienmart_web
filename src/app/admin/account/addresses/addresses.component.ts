import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
import { AddressService } from 'src/app/services/address.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.scss']
})
export class AddressesComponent implements OnInit {

  billingForm: FormGroup;
  addressForm: FormGroup;
  addressEditionForm: FormGroup;
  countries = [];
  addresses = [];
  edition = false;
  addressToEdit: any;
  selected = new FormControl(0);

  constructor(public appService: AppService, public formBuilder: FormBuilder, public snackBar: MatSnackBar,
    public addrService: AddressService, public auth: AuthService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getUsersAddresses();
    this.getCountries();
    this.addressForm = this.formBuilder.group({
      'name': ['', Validators.required],
      'street': ['', Validators.required],
      'suburb': ['', Validators.required],
      'city': ['', Validators.required],
      'state_id': ['', Validators.required],
      'country_id': ['', Validators.required],
      'postal_code': ['', Validators.required]
    });
    this.addressEditionForm = this.formBuilder.group({
      'name': ['', Validators.required],
      'street': ['', Validators.required],
      'suburb': ['', Validators.required],
      'city': ['', Validators.required],
      'state_id': ['', Validators.required],
      'country_id': ['', Validators.required],
      'postal_code': ['', Validators.required]
    });
  }

  public onAddressFormSubmit(values: Object): void {
    if (this.addressForm.valid) {
      this.auth.getToken().subscribe(token => {
        this.addrService.createAddress(values, token).subscribe(data => {
          this.getUsersAddresses();
          this.snackBar.open('La dirección ha sido creada con éxito.', '×', { panelClass: 'success', verticalPosition: 'bottom', duration: 3000 });
          this.selected.setValue(0);
          this.addressForm.reset();
          this.addressEditionForm.reset();
          this.edition = false;
        }, error => {
          this.snackBar.open(error.error.error, '×', { panelClass: 'error', verticalPosition: 'bottom', duration: 3000 });
        })
      })
    }
  }

  public onAddressEditionFormSubmit(values: Object): void {
    if (this.addressEditionForm.valid) {
      this.auth.getToken().subscribe(token => {
        this.addrService.updateAddress(this.addressToEdit, values, token).subscribe(data => {
          this.getUsersAddresses();
          this.snackBar.open('La dirección ha sido modificada con éxito.', '×', { panelClass: 'success', verticalPosition: 'bottom', duration: 3000 });
          this.selected.setValue(0);
          this.addressForm.reset();
          this.addressEditionForm.reset();
          this.edition = false;
        }, error => {
          this.snackBar.open(error.error.error, '×', { panelClass: 'error', verticalPosition: 'bottom', duration: 3000 });
        })
      })
    }
  }

  public getUsersAddresses() {
    this.auth.getToken().subscribe(token => {
      this.addrService.getAddressesForUser(token).subscribe(data => {
        this.addresses = data;
      });
    });
  }

  public getCountries() {
    this.addrService.getCountries().subscribe(data => {
      this.countries = data;
    })
  }

  removeAddress(address: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: {
        title: "Eliminar dirección",
        message: "¿Está seguro que desea eliminar esta dirección? Los pedidos realizados con esta dirección permanecerán con esta misma."
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.auth.getToken().subscribe(token => {
          this.addrService.removeAddress(address.id, token).subscribe(data => {
            this.getUsersAddresses();
            this.snackBar.open(data.message, '×', { panelClass: 'success', verticalPosition: 'bottom', duration: 3000 });
          }, error => {
            this.snackBar.open(error.error.error, '×', { panelClass: 'error', verticalPosition: 'bottom', duration: 6000 });
          })
        })
      }
    })
  }

  editAddress(address: any) {
    this.addressEditionForm.reset();
    this.edition = true;
    this.addressToEdit = address.id;
    this.addressEditionForm.patchValue(address);
    this.selected.setValue(2);
  }

  cancel(event) {
    event.preventDefault();
    this.selected.setValue(0);
    this.addressForm.reset();
    this.addressEditionForm.reset();
    this.edition = false;
    this.addressToEdit = 0;
  }

  tabChange(event) {
    this.selected.setValue(event);
    if (event == 0 || event == 1) {
      this.addressForm.reset();
      this.addressEditionForm.reset();
      this.edition = false;
      this.addressToEdit = 0;
    }
  }

}
