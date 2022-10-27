import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';

const apiUrl = environment.apiUrl;
//const apiUrl = 'https://alienmart-shop.herokuapp.com/api/v1';
//const apiUrlLocal = 'http://localhost:3001/api/v1';
@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private http: HttpClient) {

  }

  public getUserOrders(token): Observable<any> {
    const httpHeaders: HttpHeaders = new HttpHeaders({ token: token });
    return this.http.get<any>(`${apiUrl}/orders`, { headers: httpHeaders });
  }

  public getSellerOrders(token, page?: number, status?: number): Observable<any> {
    if (!page) page = 1;
    const httpHeaders: HttpHeaders = new HttpHeaders({ token: token });
    return this.http.get<any>(`${apiUrl}/sales?page=${page}${status ? '&s=' + status : ''}`, { headers: httpHeaders });
  }

  public getOrderById(oid, token): Observable<any> {
    const httpHeaders: HttpHeaders = new HttpHeaders({ token: token });
    return this.http.get<any>(`${apiUrl}/orders/${oid}`, { headers: httpHeaders });
  }

  public updateInvoice(oid, type, data, token): Observable<any> {
    const httpHeaders: HttpHeaders = new HttpHeaders({ token: token });
    return this.http.put<any>(`${apiUrl}/invoice/${oid}?type=${type}`, data, { headers: httpHeaders });
  }


  public createOrder(data, token): Observable<any> {
    const httpHeaders: HttpHeaders = new HttpHeaders({ token: token });
    return this.http.post(`${apiUrl}/orders`, data, { headers: httpHeaders });
  }

  public shipOrder(oid, token): Observable<any> {
    const httpHeaders: HttpHeaders = new HttpHeaders({ token: token });
    return this.http.post(`${apiUrl}/ship/${oid}`, {}, { headers: httpHeaders });
  }

  public createItemIssue(data, token): Observable<any> {
    const httpHeaders: HttpHeaders = new HttpHeaders({ token: token });
    return this.http.post(`${apiUrl}/issue`, data, { headers: httpHeaders });
  }


}
