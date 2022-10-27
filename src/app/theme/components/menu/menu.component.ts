import { Component, OnInit, Input } from '@angular/core';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  public mainCategories = [];
  public secondCategories = [];
  public categories: any[];
  public interestCategoriesIds = [71, 150, 183, 734, 333, 579, 542, 351, 212, 485, 7, 163]

  constructor(public appService: AppService) {
    this.secondCategories = [];
  }

  ngOnInit() {
    this.getCategories();
  }

  getCategories() {
    if (this.appService.Data.categories.length == 0) {
      this.appService.getCategories().subscribe(data => {
        this.categories = data;
        this.mainCategories = this.categories.filter(x => {
          return this.interestCategoriesIds.includes(x.id);
        }).sort((a, b) => (a.description > b.description) ? 1 : ((b.description > a.description) ? -1 : 0));
        this.appService.Data.categories = data;
      });
    }
    else {
      this.categories = this.appService.Data.categories;
      this.mainCategories = this.categories.filter(x => {
        return this.interestCategoriesIds.includes(x.id);
      }).sort((a, b) => (a.description > b.description) ? 1 : ((b.description > a.description) ? -1 : 0));
    }
  }

  openMegaMenu() {
    let pane = document.getElementsByClassName('cdk-overlay-pane');
    [].forEach.call(pane, function (el) {
      if (el.children.length > 0) {
        if (el.children[0].classList.contains('mega-menu')) {
          el.classList.add('mega-menu-pane');
        }
      }
    });
  }

  changeCategory(event) {
    let catId = parseInt(event.name);
    this.secondCategories = this.categories.filter(x => x.parent_id == catId);
    this.secondCategories.forEach(x => {
      x.thirdCategories = this.categories.filter(c => c.parent_id == x.id);
      x.thirdCategories = x.thirdCategories.sort((x, y) => x.id - y.id);
    })
  }

  public clear() {
    this.appService.Data.cartList.forEach(product => {
      this.appService.resetProductcart_count(product);
    });
    this.appService.Data.cartList.length = 0;
    this.appService.Data.totalPrice = 0;
    this.appService.Data.totalcart_count = 0;
  }

  public stopClickPropagate(event: any) {
    event.stopPropagation();
    event.preventDefault();
  }



}
