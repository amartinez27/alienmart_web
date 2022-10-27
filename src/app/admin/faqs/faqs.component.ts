import { Component, OnInit } from '@angular/core';
import { FaqsService } from 'src/app/services/faqs.service';
import { AppService } from 'src/app/services/app.service';
import { MatDialog } from '@angular/material/dialog';
import { AppSettings } from 'src/app/app.settings';
import { FaqsDialogComponent } from './faqs-dialog/faqs-dialog.component';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss']
})
export class FaqsComponent implements OnInit {
  faqs = [];
  constructor(private faqService: FaqsService, public appService: AppService, public dialog: MatDialog, public appSettings: AppSettings,
    public auth: AuthService, public snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getFaqs();
  }

  getFaqs() {
    this.faqService.getFAQs().subscribe(data => {
      this.faqs = data;
    })
  }

  public openFaqDialog(data: any) {
    const dialogRef = this.dialog.open(FaqsDialogComponent, {
      data: {
        faq: data
      },
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getFaqs();
      }
    });
  }


  remove(faq) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: {
        title: "Eliminar preguntar",
        message: "Se eliminará esta pregunta frecuente de la página web. ¿Desea continuar?",
        accept: "Sí, continuar",
        cancel: "Cancelar"
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.auth.getToken().subscribe(token => {
          this.faqService.deleteFAQ(faq.id, token).subscribe(data => {
            this.snackBar.open(data.message, '×', { panelClass: 'success', verticalPosition: 'bottom', duration: 3000 });
            this.getFaqs();
          }, error => {
            this.snackBar.open(error.error?.error, '×', { panelClass: 'success', verticalPosition: 'bottom', duration: 3000 });
          })
        })

      }
    });

  }


}
