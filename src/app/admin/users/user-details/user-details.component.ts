import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { AuthService } from 'src/app/services/auth.service';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  private sub: any;
  user: any;
  constructor(private activatedRoute: ActivatedRoute, public userService: UsersService, public auth: AuthService, public usersService: UsersService, public snackBar: MatSnackBar, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.sub = this.activatedRoute.params.subscribe(params => {
      this.getUserById(params['id']);
    });
  }

  getUserById(id) {
    this.auth.getToken().subscribe(token => {
      this.userService.getUserById(id, token).subscribe(data => {
        this.user = data;
        if (this.user.gender == 1) {
          this.user.gender = 'Masculino';
        }
        else if (this.user.gender == 2) {
          this.user.gender = 'Femenino';
        } else {
          this.user.gender = 'Otro';

        }
        data.orders.forEach(x => {
          if (x.status == 1) {
            x.statusDesc = 'No preparado';
          } else if (x.status == 2) {
            x.statusDesc = 'Abierto';
          } else {
            x.statusDesc = 'Cerrado';
          }
        });
      })
    })
  }

  public remove() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: {
        title: "Confirme acción",
        message: "Se eliminará el usuario del sistema, ¿desea eliminarlo?",
        accept: "Sí, eliminar",
        cancel: "Cancelar"
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.auth.getToken().subscribe(token => {
          this.usersService.deleteUser(this.user.id, token).subscribe(res => {
            this.snackBar.open(res.message, '×', { panelClass: 'success', verticalPosition: 'bottom', duration: 3000 });
            this.getUserById(this.user.id);
          })
        })
      }
    });
  }

}
