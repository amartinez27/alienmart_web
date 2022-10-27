import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Settings, AppSettings } from './app.settings';
import { AuthService } from './services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  loading: boolean = false;
  public settings: Settings;
  constructor(public appSettings: AppSettings, public router: Router, public auth: AuthService, public dialog: MatDialog) {
    this.settings = this.appSettings.settings;
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (event.url != '/admin/account/information' && this.auth.isLoggedIn) {
          this.checkUserData();
        }
      }
    })
  }

  checkUserData() {
    let userInfo = JSON.parse(localStorage.getItem('user'));
    const { birth_date, first_name, gender, last_name, phone } = userInfo;
    let missing = birth_date && first_name && gender && last_name && phone ? false : true
    if (missing) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        maxWidth: "400px",
        data: {
          title: "Información de perfil",
          message: "Ve a tu perfil para que llenes tus datos faltantes y puedas seguir utilizando Alienmart",
          cancel: 'Cerrar',
          accept: 'Ir a mi perfil'
        },
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.router.navigateByUrl('/admin/account/information');
        }
      })
    }

  }

  ngOnInit() {
    // this.router.navigate(['']);  //redirect other pages to homepage on browser refresh    
  }

  ngAfterViewInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    })
  }
}
