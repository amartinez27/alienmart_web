import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { MatDialog } from '@angular/material/dialog';
import { CategoriesService } from 'src/app/services/categories.service';
import { AdvertisementsService } from 'src/app/services/advertisements.service';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-advertisement-list',
  templateUrl: './advertisement-list.component.html',
  styleUrls: ['./advertisement-list.component.scss']
})
export class AdvertisementListComponent implements OnInit {

  public products: Array<any> = [];
  public filteredProds: Array<any> = [];
  public viewCol: number = 25;
  public page: any;
  public count = 10;
  public categories: any[] = [];
  constructor(public appService: AppService, public dialog: MatDialog, public catService: CategoriesService,
    public adService: AdvertisementsService, public auth: AuthService, public snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getCategories();
    this.getAllAds();
  }

  public onPageChanged(event) {
    this.page = event;
    window.scrollTo(0, 0);
  }

  public getCategories() {
    this.catService.getAdCategories().subscribe(data => {
      this.categories = data;
    });
  }

  public getAllAds() {
    let userId = JSON.parse(localStorage.getItem('user')).id;

    this.adService.getAdvertisementsByUserId(userId).subscribe(data => {
      this.products = data;
      this.filteredProds = data;
      //for show more product  
      /*for (var index = 0; index < 3; index++) {
        this.products = this.products.concat(this.products);
      }
      for (var index = 0; index < 3; index++) {
        this.filteredProds = this.filteredProds.concat(this.filteredProds);
      }*/
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
            this.getAllAds();
          }, error => {
            this.snackBar.open(error.error.error, '×', { panelClass: 'error', verticalPosition: 'bottom', duration: 5000 });
          })
        })
      }
    });
  }

}
