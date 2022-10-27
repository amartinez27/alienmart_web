import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppSettings, Settings } from '../../app.settings';
import { User, UserProfile, UserWork, UserContacts, UserSocial, UserSettings } from './user.model';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { UsersService } from 'src/app/services/users.service';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],

})
export class UsersComponent implements OnInit {
    public users: any[] = [];
    public searchText: string = "";
    public page: any;
    public settings: Settings;
    public count = 10;
    totalItems = 0;
    constructor(public appSettings: AppSettings,
        public dialog: MatDialog,
        public usersService: UsersService, public router: Router,
        public auth: AuthService,
        public snackBar: MatSnackBar) {
        this.settings = this.appSettings.settings;
    }

    ngOnInit() {
        this.getUsers();
    }

    public getUsers(): void {
        this.users = null; //for show spinner each time
        this.usersService.getUsers().subscribe(data => {
            this.users = data.users;
            this.totalItems = data.totalItems;
        });
    }

    public onPageChanged(event) {
        this.page = event;
        this.usersService.getUsers(this.page, this.searchText.split(' ').join(',')).subscribe(data => {
            this.users = data.users;
        });
        window.scrollTo(0, 0);
    }

    viewUser(user: any) {
        this.router.navigate(["admin/users", user.id]);
    }

    public remove(user) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            maxWidth: "400px",
            data: {
                title: "Confirmar acción",
                message: "¿Está seguro de querer bloquear a este usuario? Esta acción será irreversible.",
                accept: "Sí, bloquear",
                cancel: "Cancelar"
            }
        });
        dialogRef.afterClosed().subscribe(dialogResult => {
            if (dialogResult) {
                this.auth.getToken().subscribe(token => {
                    this.usersService.deleteUser(user.id, token).subscribe(res => {
                        this.snackBar.open(res.message, '×', { panelClass: 'success', verticalPosition: 'bottom', duration: 3000 });
                        this.getUsers();
                    })
                })
            }
        });
    }

    applyFilter(event: Event) {
        this.searchText = (event.target as HTMLInputElement).value.toLowerCase();
        if (this.searchText.length > 0) {
            this.searchText = this.searchText.split(' ').join(',');
            this.page = 1;
            this.usersService.getUsers(this.page, this.searchText).subscribe(data => {
                this.users = data.users;
                this.totalItems = data.totalItems;
            });
            window.scrollTo(0, 0);
        } else if (this.searchText.length == 0) {
            this.getUsers();
        }
    }

}