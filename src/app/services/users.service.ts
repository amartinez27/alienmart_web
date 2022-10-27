import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  public getUsers(page?: number, query?: string): Observable<any> {
    if (!page) page = 1;
    let route = `${apiUrl}/users?page=${page}`;
    route = query ? `${route}&q=${query}` : route;
    return this.http.get<any>(route);
  }

  public getSellers(page?: number, query?: string): Observable<any> {
    if (!page) page = 1;
    let route = `${apiUrl}/sellers?page=${page}`;
    route = query ? `${route}&q=${query}` : route;
    return this.http.get<any>(route);
  }

  public getSellersRequests(page?: number, query?: string): Observable<any> {
    if (!page) page = 1;
    return this.http.get<any>(`${apiUrl}/sellersrequests?page=${page}`);
  }

  public getUserById(id: any, token: any): Observable<any> {
    const httpHeaders: HttpHeaders = new HttpHeaders({ token: token });
    return this.http.get<any>(`${apiUrl}/users/${id}`, { headers: httpHeaders });
  }

  public createUser(data, token): Observable<any> {
    //const httpHeaders: HttpHeaders = new HttpHeaders({ token: token });
    if (data.birth_date) { data.birth_date = this.formatDate(data.birth_date) };
    delete data.password;
    delete data.confirmPassword;
    return this.http.post(`${apiUrl}/users`, data);
  }

  public updateUser(id, data, token): Observable<any> {
    const httpHeaders: HttpHeaders = new HttpHeaders({
      token: token
    });
    return this.http.put(`${apiUrl}/users/${id}`, data, { headers: httpHeaders });
  }

  public updateUserFile(type, data, token): Observable<any> {
    const httpHeaders: HttpHeaders = new HttpHeaders({
      token: token
    });
    return this.http.put(`${apiUrl}/file?type=${type}`, data, { headers: httpHeaders });
  }

  public getUserDashboard(token): Observable<any> {
    const httpHeaders: HttpHeaders = new HttpHeaders({ token: token });
    return this.http.get(`${apiUrl}/dashboard`, { headers: httpHeaders });
  }

  public getHourlyNumbers(token, day, month, year): Observable<any> {
    const httpHeaders: HttpHeaders = new HttpHeaders({ token: token });
    return this.http.get(`${apiUrl}/hourly-numbers?d=${day}&m=${month}&y=${year}`, { headers: httpHeaders });
  }

  public getLoggedUser(token): Observable<any> {
    const httpHeaders: HttpHeaders = new HttpHeaders({
      token: token
    });
    return this.http.get(`${apiUrl}/users/login`, { headers: httpHeaders });
  }

  public deleteUser(id, token): Observable<any> {
    const httpHeaders: HttpHeaders = new HttpHeaders({ token: token });
    return this.http.delete(`${apiUrl}/users/${id}`, { headers: httpHeaders });
  }

  public createSeller(id, token): Observable<any> {
    const httpHeaders: HttpHeaders = new HttpHeaders({ token: token });
    return this.http.post(`${apiUrl}/role/seller/${id}`, {}, { headers: httpHeaders });
  }

  public denyRequest(id, token): Observable<any> {
    const httpHeaders: HttpHeaders = new HttpHeaders({ token: token });
    return this.http.put(`${apiUrl}/deny/${id}`, {}, { headers: httpHeaders });
  }


  private handleError(error: Response | any) {
    console.error('ApiService::handleError', error);
    return throwError(error);
  }

  public getTerms(): Observable<any> {
    return this.http.get(`${apiUrl}/terms`);
  }





  public formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }
}
