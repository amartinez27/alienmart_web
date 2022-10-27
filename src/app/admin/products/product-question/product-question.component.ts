import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup, FormArray, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from 'src/app/services/products.service';
import { AuthService } from 'src/app/services/auth.service';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { AnswerDialogComponent } from '../answer-dialog/answer-dialog.component';

@Component({
  selector: 'app-product-question',
  templateUrl: './product-question.component.html',
  styleUrls: ['./product-question.component.scss']
})
export class ProductQuestionComponent implements OnInit {
  myFormGroup: FormGroup;
  questions = [];
  unanswered = [];
  constructor(public dialogRef: MatDialogRef<ProductQuestionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fb: FormBuilder,
    public snackBar: MatSnackBar,
    public productService: ProductService,
    public auth: AuthService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder) {
    this.myFormGroup = new FormGroup({
      formArrayName: this.formBuilder.array([])
    })
  }
  ngOnInit(): void {
    if (this.data.id) {
      this.getQuestions(this.data.id);
    }
  }

  getQuestions(pid) {
    this.auth.getToken().subscribe(token => {
      this.productService.getProductQuestions(pid, token).subscribe(data => {
        this.questions = data.filter(x => x.answer != null);
        this.unanswered = data.filter(x => x.answer == null);
        this.buildForm();

      }, error => {
        this.snackBar.open(error.error.error, 'x', { panelClass: 'error', verticalPosition: 'bottom', duration: 5000 })
      })
    })
  }

  buildForm() {
    const controlArray = this.myFormGroup.get('formArrayName') as FormArray;
    Object.keys(this.unanswered).forEach(x => {
      controlArray.push(
        this.formBuilder.group({
          answer: new FormControl()
        })
      )
    });
  }


  public openAnswerDialog(data: any) {
    const dialogRef = this.dialog.open(AnswerDialogComponent, {
      data: {
        data
      },
      width: '420px',
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getQuestions(this.data.id);
    });
  }

  public remove(id: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: {
        title: "Eliminar comentario",
        message: "Se eliminará el comentario del producto. Esta acción es irreversible. ¿Desea eliminarlo?",
        accept: "Sí, eliminar",
        cancel: "Cancelar"
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.auth.getToken().subscribe(token => {
          this.productService.deleteProductQuestion(id, token).subscribe(data => {
            this.snackBar.open(data.message, '×', { panelClass: 'success', verticalPosition: 'bottom', duration: 3000 });
            this.getQuestions(this.data.id);
          }, error => {
            this.snackBar.open(error.error.error, '×', { panelClass: 'error', verticalPosition: 'bottom', duration: 5000 });
          })
        })
      }
    });
  }

  public approve(id: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: {
        title: "Aprobar pregunta",
        message: "Se aprobará la pregunta del producto y será visible en Alienmart. ¿Desea continuar?",
        accept: "Sí, continuar",
        cancel: "Cancelar"
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.auth.getToken().subscribe(token => {
          this.productService.approveProductQuestion(id, token).subscribe(data => {
            this.snackBar.open(data.message, '×', { panelClass: 'success', verticalPosition: 'bottom', duration: 3000 });
            this.getQuestions(this.data.id);
          }, error => {
            this.snackBar.open(error.error.error, '×', { panelClass: 'error', verticalPosition: 'bottom', duration: 5000 });
          })
        })
      }
    });
  }

}
