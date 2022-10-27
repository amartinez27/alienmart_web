import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AppSettings } from 'src/app/app.settings';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {
  public userImage = 'assets/images/others/admin.jpg';
  level = '';

  constructor(public afAuth: AuthService, public appSettings: AppSettings) { }

  ngOnInit(): void {
  }

  public logOut() {
    this.afAuth.logout();
  }

}
