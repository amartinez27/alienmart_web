import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { AppSettings, Settings } from '../../../app.settings';
import { MenuService } from './menu.service';

@Component({
  selector: 'app-admin-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [MenuService]
})
export class MenuComponent implements OnInit {
  @Input('menuItems') menuItems;
  @Input('menuParentId') menuParentId;
  parentMenu: Array<any>;
  public settings: Settings;
  isAdmin = false;
  isSeller = false;
  constructor(public appSettings: AppSettings, public menuService: MenuService) {
    this.settings = this.appSettings.settings;
    this.isAdmin = JSON.parse(localStorage.getItem('user')).roles?.includes("admin");
    this.isSeller = JSON.parse(localStorage.getItem('user')).roles?.includes("vendedor");
  }

  ngOnInit() {
    this.parentMenu = this.menuItems.filter(item => item.parentId == this.menuParentId);
    this.parentMenu = this.isAdmin ? this.parentMenu : this.parentMenu.filter(x => x.id < 30 || x.id > 39);
    this.parentMenu = this.isSeller || this.isAdmin ? this.parentMenu : this.parentMenu.filter(x => x.id < 40 || x.id > 49);
  }

  onClick(menuId) {
    this.menuService.toggleMenuItem(menuId);
    this.menuService.closeOtherSubMenus(this.menuItems, menuId);
  }

}
