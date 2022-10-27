import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-terms-dialog',
  templateUrl: './terms-dialog.component.html',
  styleUrls: ['./terms-dialog.component.scss']
})
export class TermsDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

}
