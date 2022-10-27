import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';

const apiUrl = environment.apiUrl;

@Injectable({
    providedIn: 'root'
})
export class AddressService {

    constructor(private http: HttpClient) {

    }

    public getCountries(): Observable<any> {
        return this.http.get<any>(`${apiUrl}/addresses/countries`);
    }

    public getAddressesForUser(token): Observable<any> {
        const httpHeaders: HttpHeaders = new HttpHeaders({ token: token });
        return this.http.get<any>(`${apiUrl}/addresses`, { headers: httpHeaders });
    }

    public createAddress(data, token): Observable<any> {
        const httpHeaders: HttpHeaders = new HttpHeaders({ token: token });
        return this.http.post(`${apiUrl}/addresses`, data, { headers: httpHeaders });
    }

    public removeAddress(aid, token): Observable<any> {
        const httpHeaders: HttpHeaders = new HttpHeaders({ token: token });
        return this.http.delete(`${apiUrl}/addresses/${aid}`, { headers: httpHeaders });
    }

    public updateAddress(aid, data, token): Observable<any> {
        const httpHeaders: HttpHeaders = new HttpHeaders({ token: token });
        return this.http.put(`${apiUrl}/addresses/${aid}`, data, { headers: httpHeaders });
    }



}
