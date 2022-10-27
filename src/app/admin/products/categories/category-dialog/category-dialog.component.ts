import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriesService } from 'src/app/services/categories.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-category-dialog',
  templateUrl: './category-dialog.component.html',
  styleUrls: ['./category-dialog.component.scss']
})
export class CategoryDialogComponent implements OnInit {
  public form: FormGroup;
  constructor(public dialogRef: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fb: FormBuilder,
    public catService: CategoriesService,
    public snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: 0,
      description: [null, Validators.required],
      is_featured: false,
      hex_color: [null, Validators.required],
      icon_name: [null, Validators.required],
      parent_id: 0
    });

    if (this.data.category) {
      this.form.patchValue(this.data.category);
    };
  }

  public onSubmit(values) {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
      delete values.id;
      values.description = values.description.trim();
      values.parent_id = values.parent_id == 0 ? null : values.parent_id;
      if (this.data.category) {
        this.catService.updateCategory(this.data.category.id, values).subscribe(data => {
          this.snackBar.open('La categoría se ha modificado exitosamente.', '×', { panelClass: 'success', verticalPosition: 'bottom', duration: 3000 });
        }, error => {
          this.snackBar.open(error.error?.error, '×', { panelClass: 'success', verticalPosition: 'bottom', duration: 3000 });
        })
      } else {
        this.catService.createCategory(values).subscribe(data => {
          this.snackBar.open('La categoría se ha creado exitosamente.', '×', { panelClass: 'success', verticalPosition: 'bottom', duration: 3000 });
        }, error => {
          this.snackBar.open(error.error?.error, '×', { panelClass: 'success', verticalPosition: 'bottom', duration: 3000 });
        })
      }
    }
  }

}
