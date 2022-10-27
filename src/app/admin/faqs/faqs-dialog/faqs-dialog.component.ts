import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FaqsService } from 'src/app/services/faqs.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-faqs-dialog',
  templateUrl: './faqs-dialog.component.html',
  styleUrls: ['./faqs-dialog.component.scss']
})
export class FaqsDialogComponent implements OnInit {
  public form: FormGroup;

  constructor(public dialogRef: MatDialogRef<FaqsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fb: FormBuilder,
    public faqService: FaqsService,
    public snackBar: MatSnackBar,
    public auth: AuthService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: 0,
      question: [null, [Validators.required, Validators.maxLength(128)]],
      answer: [null, [Validators.required, Validators.maxLength(1000)]]
    });

    if (this.data.faq) {
      this.form.patchValue(this.data.faq);
    };
  }

  public onSubmit(values) {
    if (this.form.valid) {
      delete values.id;
      if (this.data.faq) {
        this.auth.getToken().subscribe(token => {
          this.faqService.updateFAQ(this.data.faq.id, values, token).subscribe(data => {
            this.snackBar.open(data.message, '×', { panelClass: 'success', verticalPosition: 'bottom', duration: 3000 });
            this.dialogRef.close(this.form.value);
          }, error => {
            this.snackBar.open(error.error?.error, '×', { panelClass: 'success', verticalPosition: 'bottom', duration: 3000 });
          })
        })
      } else {
        this.auth.getToken().subscribe(token => {
          this.faqService.createFAQ(values, token).subscribe(data => {
            this.dialogRef.close(this.form.value);

            this.snackBar.open('Se ha creado la pregunta frecuente.', '×', { panelClass: 'success', verticalPosition: 'bottom', duration: 3000 });
          }, error => {
            this.snackBar.open(error.error?.error, '×', { panelClass: 'success', verticalPosition: 'bottom', duration: 3000 });
          })
        })
      }
    }
  }

}
