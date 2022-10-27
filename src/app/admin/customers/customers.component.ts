import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { MatDialog } from '@angular/material/dialog';
import { CustomerDialogComponent } from './customer-dialog/customer-dialog.component';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { customers } from './customers';
import { AppSettings, Settings } from 'src/app/app.settings';
import { UsersService } from 'src/app/services/users.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  public customers = [];
  public stores = [
    { id: 1, name: 'Store 1' },
    { id: 2, name: 'Store 2' }
  ]
  public countries = [];
  public page: any;
  public rPage: any;
  public count = 10;
  public searchText: string = "";

  sellers = [];
  requests = [];
  totalSellers = 0;
  totalRequests = 0;
  public settings: Settings;
  constructor(public appService: AppService, public dialog: MatDialog, public appSettings: AppSettings,
    public usersService: UsersService, public router: Router, public auth: AuthService, public snackBar: MatSnackBar) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit(): void {
    this.countries = this.appService.getCountries();
    this.getSellers();
    this.getRequests();
  }

  getSellers() {
    this.usersService.getSellers().subscribe(data => {
      this.sellers = data.users;
      this.totalSellers = data.totalItems;
    });
  }

  getRequests() {
    this.usersService.getSellersRequests().subscribe(data => {
      this.requests = data.users;
      this.totalRequests = data.totalItems;
    });
  }

  public onPageChanged(event) {
    this.page = event;
    window.scrollTo(0, 0);
  }

  public onPageChangedReqs(event) {
    this.rPage = event;
    window.scrollTo(0, 0);
  }

  public openCustomerDialog(data: any) {
    const dialogRef = this.dialog.open(CustomerDialogComponent, {
      data: {
        customer: data,
        stores: this.stores,
        countries: this.countries
      },
      panelClass: ['theme-dialog'],
      autoFocus: false,
      direction: (this.settings.rtl) ? 'rtl' : 'ltr'
    });
    dialogRef.afterClosed().subscribe(customer => {
      if (customer) {
        const index: number = this.customers.findIndex(x => x.id == customer.id);
        if (index !== -1) {
          this.customers[index] = customer;
        }
        else {
          let last_customer = this.customers[this.customers.length - 1];
          customer.id = last_customer.id + 1;
          this.customers.push(customer);
        }
      }
    });
  }

  public remove(user: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: {
        title: "Confirmar acción",
        message: "¿Está seguro de querer bloquear a este usuario? Esta acción será irreversible.",
        accept: "Sí, bloquear",
        cancel: "Cancelar"
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.auth.getToken().subscribe(token => {
          this.usersService.deleteUser(user.id, token).subscribe(res => {
            this.snackBar.open(res.message, '×', { panelClass: 'success', verticalPosition: 'bottom', duration: 3000 });
            this.getSellers();
            this.getRequests();
          })
        })
      }
    });
  }

  public deny(user: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: {
        title: "Confirmar acción",
        message: "Se rechazará la solicitud del usuario. ¿Desea continuar?",
        accept: "Sí, rechazar",
        cancel: "Cancelar"
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.auth.getToken().subscribe(token => {
          this.usersService.denyRequest(user.id, token).subscribe(res => {
            this.snackBar.open(res.message, '×', { panelClass: 'success', verticalPosition: 'bottom', duration: 3000 });
            this.getSellers();
            this.getRequests();
          })
        })
      }
    });
  }

  public approve(user: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: {
        title: "Confirmar acción",
        message: "Se le brindarán permisos de vendedor al usuario. ¿Desea continuar?"
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.auth.getToken().subscribe(token => {
          this.usersService.createSeller(user.id, token).subscribe(res => {
            this.snackBar.open(res.message, '×', { panelClass: 'success', verticalPosition: 'bottom', duration: 3000 });
            this.getSellers();
            this.getRequests();
          })
        })
      }
    });
  }

  applyFilter(event: Event) {
    this.searchText = (event.target as HTMLInputElement).value.toLowerCase();
    if (this.searchText.length > 0) {
      this.searchText = this.searchText.split(' ').join(',');
      this.page = 1;
      this.usersService.getSellers(this.page, this.searchText).subscribe(data => {
        this.sellers = data.users;
        this.totalSellers = data.totalItems;
      });
      window.scrollTo(0, 0);
    } else if (this.searchText.length == 0) {
      this.getSellers();
    }
  }

  viewUser(user: any) {
    this.router.navigate(["admin/customers", user.id]);
  }

}
