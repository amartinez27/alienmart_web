import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { OrdersService } from 'src/app/services/orders.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-order-issue-dialog',
  templateUrl: './order-issue-dialog.component.html',
  styleUrls: ['./order-issue-dialog.component.scss']
})
export class OrderIssueDialogComponent implements OnInit {
  public form: FormGroup;
  step = 0;
  reason = '';
  constructor(public dialogRef: MatDialogRef<OrderIssueDialogComponent>, public fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any,
    public auth: AuthService, public orderService: OrdersService, public snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      message: ['', Validators.required]
    });
  }
  onSubmit(values) {
    if (this.form.valid) {
      let info = { order_item_id: this.data.order.id, reason: this.reason, message: values.message };
      this.auth.getToken().subscribe(token => {
        this.orderService.createItemIssue(info, token).subscribe(data => {
          this.snackBar.open('Se ha enviado su mensaje al vendedor. En breve se comunicará con usted.', 'x', { panelClass: 'success', verticalPosition: 'bottom', duration: 5000 })
          this.dialogRef.close(true);
        }, error => {
          this.snackBar.open(error.error.error, 'x', { panelClass: 'error', verticalPosition: 'bottom', duration: 3000 });
          this.dialogRef.close(true);
        })
      })
    }
  }

  backFirst() {
    this.step = 0;
    this.reason = '';
  }

  withProblem() {
    this.step = 1;
  }
  notReceived() {
    this.step = 2;
  }

  setReason(reason) {
    this.step = 4;
    this.reason = reason;
  }

}
