import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/products.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-answer-dialog',
  templateUrl: './answer-dialog.component.html',
  styleUrls: ['./answer-dialog.component.scss']
})
export class AnswerDialogComponent implements OnInit {

  public form: FormGroup;

  constructor(public auth: AuthService, public productService: ProductService, public snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data: any, public fb: FormBuilder,
    public dialogRef: MatDialogRef<AnswerDialogComponent>) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: 0,
      answer: [null, [Validators.required, Validators.maxLength(1000)]]
    });
  }

  onUpdate(qid, answer) {
    this.auth.getToken().subscribe(token => {
      this.productService.updateProductQuestion(qid, { answer }, token).subscribe(data => {
        this.snackBar.open(data.message, 'x', { panelClass: 'success', verticalPosition: 'bottom', duration: 5000 })

      }, error => {
        this.snackBar.open(error.error.error, 'x', { panelClass: 'error', verticalPosition: 'bottom', duration: 5000 })
      })
    })
  }

  public onSubmit(values) {
    if (this.form.valid) {
      this.auth.getToken().subscribe(token => {
        this.productService.updateProductQuestion(this.data.data.id, values, token).subscribe(data => {
          this.snackBar.open(data.message, '×', { panelClass: 'success', verticalPosition: 'bottom', duration: 3000 });
          this.dialogRef.close(this.form.value);
        }, error => {
          this.snackBar.open(error.error?.error, '×', { panelClass: 'success', verticalPosition: 'bottom', duration: 3000 });
        })
      })
    }

  }

}
