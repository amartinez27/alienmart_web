import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { OrdersService } from 'src/app/services/orders.service';
import { MatDialog } from '@angular/material/dialog';
import { AngularFireStorage } from '@angular/fire/storage';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-sale-detail',
  templateUrl: './sale-detail.component.html',
  styleUrls: ['./sale-detail.component.scss']
})
export class SaleDetailComponent implements OnInit {
  private sub: any;
  total = [];
  otherInvoices = [];
  totalItems = 0;
  docsForm: FormGroup;
  order: any;
  userInfo: any;
  totalMoney = 0;
  xml_invoice = { url: null, name: null };
  pdf_invoice = { url: null, name: null };
  isAdmin = false;
  canSend = false;
  pdf_url = null;
  pdfSource = null;
  constructor(private activatedRoute: ActivatedRoute, public auth: AuthService, public orderService: OrdersService,
    public dialog: MatDialog, private storage: AngularFireStorage, private spinner: NgxSpinnerService, public formBuilder: FormBuilder,
    public snackBar: MatSnackBar, public sanitization: DomSanitizer) { }

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem('user'));
    this.isAdmin = this.userInfo.roles.includes("admin");
    this.sub = this.activatedRoute.params.subscribe(params => {
      this.getOrderById(params['id']);
    });

    this.docsForm = this.formBuilder.group({
      xml_invoice: [null],
      pdf_invoice: [null],
    });
  }

  getOrderById(id) {
    this.auth.getToken().subscribe(token => {
      this.orderService.getOrderById(id, token).subscribe(data => {
        this.canSend = data.order_items.filter(x => x.seller_id == this.userInfo?.id).length > 0 ? true : false;
        data.order_items.forEach(element => {
          this.totalItems += element.quantity;
          this.total[element.id] = element.quantity * element.price;
          this.totalMoney += element.quantity * element.price;
        });
        let uniqueArray = a => [...new Set(a.map(o => JSON.stringify(o)))].map((s: any) => JSON.parse(s))
        this.otherInvoices = data.order_items.filter(x => x.seller_id != this.userInfo?.id && (x.pdf_invoice != null || x.xml_invoice != null)).map(({ xml_invoice, pdf_invoice }) => ({ xml_invoice, pdf_invoice }));
        this.otherInvoices = uniqueArray(this.otherInvoices);
        let invoices = data.order_items.filter(x => x.seller_id == this.userInfo?.id).map(({ xml_invoice, pdf_invoice }) => ({ xml_invoice, pdf_invoice }));
        invoices = uniqueArray(invoices)[0];
        if (invoices?.xml_invoice) {
          this.xml_invoice.url = invoices.xml_invoice;
          this.docsForm.controls.xml_invoice.setValue([{ link: invoices.xml_invoice, file: { name: 'FACTURA_XML', type: 'application/xml' } }]);
        }
        if (invoices?.pdf_invoice) {
          this.pdf_invoice.url = invoices.pdf_invoice;
          this.docsForm.controls.pdf_invoice.setValue([{ link: invoices.pdf_invoice, file: { name: 'FACTURA_PDF', type: 'application/pdf' } }]);
        }

        if (data.status == 1) {
          data.statusDesc = 'No preparado';
        } else if (data.status == 2) {
          data.statusDesc = 'Abierto';
        } else {
          data.statusDesc = 'Cerrado';
        }
        this.order = data;
        let tempPdf = [...new Set(data.order_items.filter(x => x.seller_id == this.userInfo.id).map(x => x.fedex_image))]
        this.pdf_url = tempPdf[0];
        if (this.pdf_url) {
          const byteArray = new Uint8Array(atob(this.pdf_url).split('').map(char => char.charCodeAt(0)));
          let blob = new Blob([byteArray], { type: 'application/pdf' });
          this.pdfSource = this.sanitization.bypassSecurityTrustUrl(window.URL.createObjectURL(blob));
        }
      })
    })

  }

  sendMyItems() {
    this.auth.getToken().subscribe(token => {
      this.orderService.shipOrder(this.order.id, token).subscribe(data => {
        this.pdf_url = data.CompletedShipmentDetail.CompletedPackageDetails[0].Label.Parts[0].Image;
        const byteArray = new Uint8Array(atob(this.pdf_url).split('').map(char => char.charCodeAt(0)));
        let blob = new Blob([byteArray], { type: 'application/pdf' });
        this.pdfSource = this.sanitization.bypassSecurityTrustUrl(window.URL.createObjectURL(blob));
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          maxWidth: "400px",
          data: {
            title: "Guía FEDEX generada",
            message: "Tu guía FEDEX se ha generado exitosamente. Deberás imprimir la guía, pegarla en tu paquete y depositarlo en tu centro FEDEX más cercano. Asegúrate que los códigos de barras sean legibles.",
            cancel: "Cerrar",
            accept: "Aceptar"
          },
        });
      }, error => {
        this.snackBar.open('Sucedió un error generando la guía. Intente más tarde o contacte a Soporte Alienmart', 'x', { panelClass: 'error', verticalPosition: 'bottom', duration: 6000 })
      })
    })
  }


  acceptFile(event, type) {
    const file = event.file;
    const file_name = `${file.name}_${Date.now()}`;
    const filePath = `invoices/${file_name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    this.spinner.show();
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            if (url) {
              this.spinner.hide();
              this.auth.getToken().subscribe(token => {
                this.orderService.updateInvoice(this.order.id, type, { url }, token).subscribe(data => {
                  if (type == 'pdf') {
                    this.pdf_invoice.url = url;
                  }
                  if (type == 'xml') {
                    this.xml_invoice.url = url;
                  }
                  this.snackBar.open(`La factura ${type.toUpperCase()} se subió de manera correcta`, 'x', { panelClass: 'success', verticalPosition: 'bottom', duration: 3000 })
                }, error => {
                  this.snackBar.open(error.error.error, 'x', { panelClass: 'error', verticalPosition: 'bottom', duration: 3000 })
                })
              })
            }
          });
        })
      ).subscribe(url => {
        if (url) {

        }
      })

  }

  deletedFile(event, type) {
    if (type == 'pdf') {
      this.docsForm.controls.pdf_invoice.reset();
      const fileRef = this.storage.refFromURL(this.pdf_invoice.url).delete();
    }
    if (type == 'xml') {
      this.docsForm.controls.xml_invoice.reset();
      const fileRef = this.storage.refFromURL(this.xml_invoice.url).delete();
    }
    this.auth.getToken().subscribe(token => {
      this.orderService.updateInvoice(this.order.id, type, { url: null }, token).subscribe(data => {
        this.snackBar.open(`La factura ${type.toUpperCase()} se ha eliminado`, 'x', { panelClass: 'success', verticalPosition: 'bottom', duration: 3000 })
      }, error => {
        this.snackBar.open(error.error.error, 'x', { panelClass: 'error', verticalPosition: 'bottom', duration: 3000 })
      })
    })
  }

}
