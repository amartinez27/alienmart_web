import { Component, OnInit, HostListener } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { Product, Category } from 'src/app/app.models';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CategoriesService } from 'src/app/services/categories.service';
import { ProductService } from 'src/app/services/products.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductQuestionComponent } from '../product-question/product-question.component';

@Component({
  selector: 'app-admin-view',
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.scss']
})
export class AdminViewComponent implements OnInit {

  totalItems = 0;
  public products: Array<Product> = [];
  public filteredProds: Array<Product> = [];
  public viewCol: number = 25;
  public page: any;
  public count = 10;
  public categories: Category[] = [];

  constructor(public appService: AppService, public dialog: MatDialog, public catService: CategoriesService,
    public prodService: ProductService, public auth: AuthService, public snackBar: MatSnackBar) { }

  ngOnInit(): void {
    if (window.innerWidth < 1280) {
      this.viewCol = 33.3;
    };
    this.getCategories();
    this.getAllProducts();
    //console.log(this.appService);
  }

  public getCategories() {
    this.catService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  public getAllProducts() {
    let userId = JSON.parse(localStorage.getItem('user')).id;

    this.prodService.getProducts(1, 10).subscribe(data => {
      this.products = data.items;
      this.filteredProds = data.items;
      this.totalItems = data.totalItems;
      //for show more product  
      /*for (var index = 0; index < 3; index++) {
        this.products = this.products.concat(this.products);
      }
      for (var index = 0; index < 3; index++) {
        this.filteredProds = this.filteredProds.concat(this.filteredProds);
      }*/
    });
  }

  public onPageChanged(event) {
    this.page = event;
    this.prodService.getProducts(this.page, 10).subscribe(data => {
      this.products = data.items;
      this.filteredProds = data.items;
    });
    window.scrollTo(0, 0);
  }

  @HostListener('window:resize')
  public onWindowResize(): void {
    (window.innerWidth < 1280) ? this.viewCol = 33.3 : this.viewCol = 25;
  }


  public remove(product: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: {
        title: "Eliminar producto",
        message: "¿Está seguro que desea eliminar este producto? Las órdenes en curso con este producto no serán eliminadas.",
        accept: "Sí, eliminar",
        cancel: "Cancelar"
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.auth.getToken().subscribe(token => {
          this.prodService.deleteProduct(product.id, token).subscribe(data => {
            this.snackBar.open(data.message, '×', { panelClass: 'success', verticalPosition: 'bottom', duration: 3000 });
            this.getAllProducts();
          }, error => {
            this.snackBar.open(error.error.error, '×', { panelClass: 'error', verticalPosition: 'bottom', duration: 5000 });
          })
        })
      }
    });
  }

  public openQuestionDialog(data: any) {
    const dialogRef = this.dialog.open(ProductQuestionComponent, {
      data: {
        id: data
      },
      width: '60vw',
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe(category => {
      this.getCategories();
    });
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredProds = !filterValue ? this.products : this.products.filter(e => {
      return e.name.toLowerCase().includes(filterValue) || e.price.toString().toLowerCase().includes(filterValue);
    });
  }

  applyCategoryFilter(event: any) {
    const catId = event.value;
    this.filteredProds = this.products.filter(e => {
      return e.category_id == catId;
    })
  }
}
