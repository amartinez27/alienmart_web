import { Component, OnInit, HostListener } from '@angular/core';
import { Category } from 'src/app/app.models';
import { AppService } from 'src/app/services/app.service';
import { MatDialog } from '@angular/material/dialog';
import { CategoriesService } from 'src/app/services/categories.service';
import { AdvertisementsService } from 'src/app/services/advertisements.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductQuestionComponent } from '../../products/product-question/product-question.component';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-ads-admin-view',
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.scss']
})
export class AdminViewComponent implements OnInit {
  totalItems = 0;
  public products: Array<any> = [];
  public filteredProds: Array<any> = [];
  public viewCol: number = 25;
  public page: any;
  public count = 10;
  public categories: Category[] = [];
  constructor(public appService: AppService, public dialog: MatDialog, public catService: CategoriesService,
    public adService: AdvertisementsService, public auth: AuthService, public snackBar: MatSnackBar) { }

  ngOnInit(): void {
    if (window.innerWidth < 1280) {
      this.viewCol = 33.3;
    };
    this.getCategories();
    this.getAllProducts();
  }

  public getCategories() {
    this.catService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  public getAllProducts() {
    let userId = JSON.parse(localStorage.getItem('user')).id;

    this.adService.getAdvertisements(1, 10).subscribe(data => {
      this.products = data.items;
      this.filteredProds = data.items;
      this.totalItems = data.totalItems;
    });
  }

  public onPageChanged(event) {
    this.page = event;
    this.adService.getAdvertisements(this.page, 10).subscribe(data => {
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
        message: "¿Está seguro que desea eliminar este anuncio?",
        accept: "Sí, eliminar",
        cancel: "Cancelar"
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.auth.getToken().subscribe(token => {
          this.adService.deleteAdvertisement(product.id, token).subscribe(data => {
            this.snackBar.open(data.message, '×', { panelClass: 'success', verticalPosition: 'bottom', duration: 3000 });
            this.getAllProducts();
          }, error => {
            this.snackBar.open(error.error.error, '×', { panelClass: 'error', verticalPosition: 'bottom', duration: 5000 });
          })
        })
      }
    });
  }

}
