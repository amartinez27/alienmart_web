import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss']
})
export class CustomerDetailComponent implements OnInit {
  private sub: any;
  user: any;
  bank_statement = { url: '' };
  id_document = { url: '' };
  constitutive_act = { url: '' };
  rfc = { url: '' };
  constructor(private activatedRoute: ActivatedRoute, public userService: UsersService, public auth: AuthService) { }

  ngOnInit(): void {
    this.sub = this.activatedRoute.params.subscribe(params => {
      this.getUserById(params['id']);
    });
  }

  getUserById(id) {
    this.auth.getToken().subscribe(token => {
      this.userService.getUserById(id, token).subscribe(data => {
        this.user = data;
        this.bank_statement = data.files.find(x => x.file_type == 'bank_statement');
        this.id_document = data.files.find(x => x.file_type == 'id_document');
        this.constitutive_act = data.files.find(x => x.file_type == 'constitutive_act');
        this.rfc = data.files.find(x => x.file_type == 'rfc');
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

}
