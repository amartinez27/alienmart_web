import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class FaqsService {

  constructor(private http: HttpClient) { }


  public createFAQ(data, token): Observable<any> {
    const httpHeaders: HttpHeaders = new HttpHeaders({ token: token });
    return this.http.post(`${apiUrl}/faqs`, data, { headers: httpHeaders });
  }

  public getFAQs(): Observable<any> {
    return this.http.get(`${apiUrl}/faqs`);
  }

  public updateFAQ(id, data, token): Observable<any> {
    const httpHeaders: HttpHeaders = new HttpHeaders({ token: token });
    return this.http.put(`${apiUrl}/faqs/${id}`, data, { headers: httpHeaders });
  }

  public deleteFAQ(id, token): Observable<any> {
    const httpHeaders: HttpHeaders = new HttpHeaders({ token: token });
    return this.http.delete(`${apiUrl}/faqs/${id}`, { headers: httpHeaders });
  }
}
