import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { emailValidator, matchingPasswords } from '../../theme/utils/app-validators';
import { AuthService } from 'src/app/services/auth.service';
import { AppSettings } from 'src/app/app.settings';
import { AngularFireAuth } from '@angular/fire/auth/auth';
import { AppService } from 'src/app/services/app.service';
import { WishlistService } from 'src/app/services/wishlist.service';
import { MatDialog } from '@angular/material/dialog';
import { TermsDialogComponent } from './terms-dialog/terms-dialog.component';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;
  generos: any;
  maxDate: Date;
  checked = false;
  terms: any;
  constructor(public formBuilder: FormBuilder, public router: Router, public snackBar: MatSnackBar,
    public authService: AuthService, public appSettings: AppSettings, public appService: AppService, public wishlistService: WishlistService,
    public dialog: MatDialog, public userService: UsersService) {
    const currentDate = new Date();
    this.maxDate = new Date(currentDate.getFullYear() - 18, currentDate.getMonth(), currentDate.getDate());
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      'email': ['', Validators.compose([Validators.required, emailValidator])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    });

    this.registerForm = this.formBuilder.group({
      'first_name': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      'last_name': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      'birth_date': ['', Validators.required],
      'gender': ['', Validators.required],
      'phone': ['', [Validators.required, Validators.pattern("^((\\+52-?)|0)?[0-9]{10}$"), Validators.minLength(10), Validators.maxLength(14)]],
      'email': ['', Validators.compose([Validators.required, emailValidator])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      'confirmPassword': ['', Validators.required],
      'terms': [false, Validators.requiredTrue]
    }, { validator: matchingPasswords('password', 'confirmPassword') });

    this.generos = [
      { value: '1', viewValue: 'Masculino' },
      { value: '2', viewValue: 'Femenino' },
      { value: '3', viewValue: 'Otro' }
    ]

    this.getTerms();

  }

  public onLoginFormSubmit(values: any): void {
    if (this.loginForm.valid) {
      this.authService.loginWithEmailAndPassword(values.email, values.password).then(result => {
        if (result) {
          this.appSettings.currentUser = result;
          this.router.navigate(['/']);
        }
      }, err => {
        if (err.code == 'auth/user-not-found') {
          this.snackBar.open('No existe una cuenta asociada a la dirección de correo electrónico que ingresaste.', '×', { panelClass: 'error', verticalPosition: 'bottom', duration: 3000 });
        } else if (err.code == 'auth/wrong-password') {
          this.snackBar.open('La contraseña ingresada es incorrecta.', '×', { panelClass: 'error', verticalPosition: 'bottom', duration: 4000 });
        }
      })
    }
  }

  public onRegisterFormSubmit(values: Object): void {
    if (this.registerForm.valid) {
      this.authService.signUpWithEmailAndPassword(values).then(result => {
        this.appSettings.currentUser = result;
        this.router.navigate(['/']);
      }, err => {
        if (err.code == 'auth/email-already-in-use') {
          this.snackBar.open('Ya existe una cuenta con esta dirección de correo electrónico.', '×', { panelClass: 'error', verticalPosition: 'bottom', duration: 3000 });
        } else {
          this.snackBar.open('No hemos podido crear su cuenta, intente de nuevo.', '×', { panelClass: 'error', verticalPosition: 'bottom', duration: 3000 });
        }
      });

    }
  }

  getTerms() {
    this.userService.getTerms().subscribe(data => {
      this.terms = data;
    })
  }

  openTerms() {
    const dialogRef = this.dialog.open(TermsDialogComponent, {
      data: {
        terms: this.terms
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
