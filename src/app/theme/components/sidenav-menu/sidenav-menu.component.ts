import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SidenavMenuService } from './sidenav-menu.service';

@Component({
  selector: 'app-sidenav-menu',
  templateUrl: './sidenav-menu.component.html',
  styleUrls: ['./sidenav-menu.component.scss'],
  providers: [SidenavMenuService]
})
export class SidenavMenuComponent implements OnInit, OnChanges {
  @Input('menuItems') menuItems;
  @Input('menuParentId') menuParentId;
  parentMenu: Array<any>;

  constructor(private sidenavMenuService: SidenavMenuService) { }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.menuItems.currentValue?.length > 0) {
      this.parentMenu = this.menuItems.filter(item => item.parentId == this.menuParentId);
    }
  }

  ngOnInit() {
    this.parentMenu = this.menuItems.filter(item => item.parentId == this.menuParentId);
  }

  onClick(menuId) {
    this.sidenavMenuService.toggleMenuItem(menuId);
    this.sidenavMenuService.closeOtherSubMenus(this.menuItems, menuId);
  }

}
