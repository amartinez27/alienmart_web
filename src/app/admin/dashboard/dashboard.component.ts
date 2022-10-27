import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { single } from './dashboard.data';
import { OrdersService } from 'src/app/services/orders.service';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  single: any[] = [];
  totalOrder = 0;
  totalReturns = 0;
  todaySales = 0;
  monthSales = 0;
  netIncome = 0;
  toPrepare = 0;
  displayedColumns: string[] = ['number', 'name', 'description', 'availability', 'price'];
  defaultDate = new FormControl(new Date())
  dataSource: any;
  data: any;
  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = false;
  showYAxisLabel = false;
  @ViewChild('resizedDiv') resizedDiv: ElementRef;
  public previousWidthOfResizedDiv: number = 0;
  colorScheme = {
    domain: ['#D32F2F']
  };
  maxDate: Date;

  constructor(public userService: UsersService, public auth: AuthService) {
    const currentDate = new Date();
    this.maxDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
  }

  ngOnInit(): void {
    //this.single = single;
    this.getDashboardData();
  }

  getDashboardData() {
    this.auth.getToken().subscribe(token => {
      this.userService.getUserDashboard(token).subscribe(response => {
        this.dataSource = new MatTableDataSource(response.products);
        this.data = response;
        this.todaySales = this.data.todayNumbers?.sum ? this.data.todayNumbers.sum : this.todaySales;
        this.monthSales = this.data.monthNumbers?.sum ? this.data.monthNumbers.sum : this.monthSales;
        this.netIncome = this.data.netIncome?.sum ? this.data.netIncome.sum : this.netIncome;
        this.data.hourlyNumbers = this.data.hourlyNumbers ? this.data.hourlyNumbers : [];
        this.data.hourlyNumbers.forEach(x => {
          this.totalOrder += x.value;
          var AmOrPm = x.name >= 12 ? 'pm' : 'am';
          x.name = (x.name % 12) || 12;
          x.name = `${x.name}${AmOrPm}`
        });
        this.single = response.hourlyNumbers;
        this.toPrepare = this.data.unprepared[0]?.count ? this.data.unprepared[0]?.count : 0;
      })
    })
  }

  onSelect(event) {
    console.log(event);
  }

  ngAfterViewChecked() {
    if (this.previousWidthOfResizedDiv != this.resizedDiv.nativeElement.clientWidth) {
      this.single = [...this.single];
    }
    this.previousWidthOfResizedDiv = this.resizedDiv.nativeElement.clientWidth;
  }

  onDateChange(event) {
    const day = event.value.getDate();
    const month = event.value.getMonth() + 1;
    const year = event.value.getFullYear();
    this.totalOrder = 0;
    this.auth.getToken().subscribe(token => {
      this.userService.getHourlyNumbers(token, day, month, year).subscribe(response => {
        response.forEach(x => {
          this.totalOrder += x.value;
          var AmOrPm = x.name >= 12 ? 'pm' : 'am';
          x.name = (x.name % 12) || 12;
          x.name = `${x.name}${AmOrPm}`
        });
        this.single = response;
      })
    })
  }

}
