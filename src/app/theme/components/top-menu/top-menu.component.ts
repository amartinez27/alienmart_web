import { Component, OnInit } from '@angular/core';
import { Data, AppService } from '../../../services/app.service';
import { Settings, AppSettings } from '../../../app.settings';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss']
})
export class TopMenuComponent implements OnInit {
  public currencies = ['USD', 'EUR'];
  public currency: any;
  public flags = [
    { name: 'English', image: 'assets/images/flags/gb.svg' },
    { name: 'German', image: 'assets/images/flags/de.svg' },
    { name: 'French', image: 'assets/images/flags/fr.svg' },
    { name: 'Russian', image: 'assets/images/flags/ru.svg' },
    { name: 'Turkish', image: 'assets/images/flags/tr.svg' }
  ]
  public flag: any;
  public isLogged: boolean;
  public settings: Settings;

  constructor(public appSettings: AppSettings, public appService: AppService, public afAuth: AuthService) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.currency = this.currencies[0];
    this.flag = this.flags[0];
  }

  public changeCurrency(currency) {
    this.currency = currency;
  }

  public changeLang(flag) {
    this.flag = flag;
  }

  public logOut() {
    this.afAuth.logout();
  }



}
