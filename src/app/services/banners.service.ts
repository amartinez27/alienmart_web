import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class BannersService {

  constructor(private http: HttpClient) { }

  public createBanner(image, token): Observable<any> {
    const httpHeaders: HttpHeaders = new HttpHeaders({ token: token });
    return this.http.post(`${apiUrl}/banners`, image, { headers: httpHeaders });
  }

  public getBanners(): Observable<any> {
    return this.http.get(`${apiUrl}/banners`);
  }

  public updateBanners(data, token): Observable<any> {
    const httpHeaders: HttpHeaders = new HttpHeaders({ token: token });
    return this.http.put(`${apiUrl}/banners`, data, { headers: httpHeaders });
  }

  public deleteBanner(id, token): Observable<any> {
    const httpHeaders: HttpHeaders = new HttpHeaders({ token: token });
    return this.http.delete(`${apiUrl}/banners/${id}`, { headers: httpHeaders });
  }
}
