import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/app.models';
import { AppService } from 'src/app/services/app.service';
import { CategoryDialogComponent } from './category-dialog/category-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { AppSettings, Settings } from 'src/app/app.settings';
import { CategoriesService } from 'src/app/services/categories.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  public categories: Category[] = [];
  public page: any;
  public count = 20;
  public settings: Settings;
  constructor(public appService: AppService, public dialog: MatDialog, public appSettings: AppSettings, public catService: CategoriesService, public snackbar: MatSnackBar) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit(): void {
    this.getCategories();
  }

  public getCategories() {
    /*this.appService.getCategories().subscribe(data => {
      this.categories = data;
      this.categories.shift();
    });*/
    this.catService.getCategories().subscribe(data => {
      this.categories = data;
    })
  }

  public onPageChanged(event) {
    this.page = event;
    window.scrollTo(0, 0);
  }

  public openCategoryDialog(data: any) {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      data: {
        category: data,
        categories: this.categories
      },
      panelClass: ['theme-dialog'],
      autoFocus: false,
      direction: (this.settings.rtl) ? 'rtl' : 'ltr'
    });
    dialogRef.afterClosed().subscribe(category => {
      this.getCategories();
      /*if (category) {
        const index: number = this.categories.findIndex(x => x.id == category.id);
        if (index !== -1) {
          this.categories[index] = category;
        }
        else {
          let last_category = this.categories[this.categories.length - 1];
          category.id = last_category.id + 1;
          this.categories.push(category);
        }
      }*/
    });
  }

  public remove(category: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: {
        title: "Confirme acción",
        message: "¿Está seguro de querer eliminar esta categoría?"
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        const index: number = this.categories.indexOf(category);
        if (index !== -1) {
          this.categories.splice(index, 1);
        }
        this.catService.deleteCategory(category.id).subscribe(result => {
          this.snackbar.open(result.message, '×', { panelClass: 'success', verticalPosition: 'bottom', duration: 3000 });

        }, error => {
          this.snackbar.open(error.error?.error, '×', { panelClass: 'error', verticalPosition: 'bottom', duration: 3000 });

        })
      }
    });
  }

}
