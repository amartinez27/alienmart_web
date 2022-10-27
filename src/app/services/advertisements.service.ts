import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class AdvertisementsService {

  constructor(private http: HttpClient) {

  }

  public getAdvertisements(page: number, limit: number, query?: string, cid?: number): Observable<any> {
    let route = `${apiUrl}/advertisements?page=${page}&limit=${limit}`;
    route = query ? `${route}&q=${query}` : route;
    route = cid ? `${route}&c=${cid}` : route;
    return this.http.get<any>(route);
  }

  public createAdvertisement(data, token): Observable<any> {
    const httpHeaders: HttpHeaders = new HttpHeaders({ token: token });
    return this.http.post(`${apiUrl}/advertisements`, data, { headers: httpHeaders });
  }

  public createAdvertisementQuestion(pid, data, token): Observable<any> {
    const httpHeaders: HttpHeaders = new HttpHeaders({ token: token });
    return this.http.post(`${apiUrl}/adquestion/${pid}`, data, { headers: httpHeaders });
  }

  public updateAdvertisement(aid, data, token): Observable<any> {
    const httpHeaders: HttpHeaders = new HttpHeaders({ token: token });
    return this.http.put(`${apiUrl}/advertisements/${aid}`, data, { headers: httpHeaders });
  }


  public updateAdvertisementQuestion(aid, data, token): Observable<any> {
    const httpHeaders: HttpHeaders = new HttpHeaders({ token: token });
    return this.http.put(`${apiUrl}/adquestion/${aid}`, data, { headers: httpHeaders });
  }

  public getAdQuestions(aid, token): Observable<any> {
    const httpHeaders: HttpHeaders = new HttpHeaders({ token: token });
    return this.http.get(`${apiUrl}/adquestions/${aid}`, { headers: httpHeaders });
  }

  public deleteAdvertisement(aid, token): Observable<any> {
    const httpHeaders: HttpHeaders = new HttpHeaders({ token: token });
    return this.http.delete(`${apiUrl}/advertisements/${aid}`, { headers: httpHeaders });
  }
  public getAdvertisementsByUserId(user_id: number): Observable<any> {
    return this.http.get(`${apiUrl}/advertisements/users/${user_id}`);
  }

  public getAdvertisementById(prod_id): Observable<any> {
    return this.http.get(`${apiUrl}/advertisements/${prod_id}`);
  }

  public getAdvertisementsForLoggedUser(page: number, limit: number, token, query?: string, cid?: number): Observable<any> {
    let route = `${apiUrl}/advertisements?page=${page}&limit=${limit}`;
    route = query ? `${route}&q=${query}` : route;
    route = cid ? `${route}&c=${cid}` : route;
    const httpHeaders: HttpHeaders = new HttpHeaders({ token: token });
    return this.http.get<any>(route, { headers: httpHeaders });
  }

  public getAdvertisementByIdForLoggedUser(prod_id, token): Observable<any> {
    const httpHeaders: HttpHeaders = new HttpHeaders({ token: token });
    return this.http.get(`${apiUrl}/advertisements/${prod_id}`, { headers: httpHeaders });
  }

  public purchaseAdBundle(data, token): Observable<any> {
    const httpHeaders: HttpHeaders = new HttpHeaders({ token: token });
    return this.http.post(`${apiUrl}/bundle-purchase`, data, { headers: httpHeaders });
  }

  public getPurchaseBundle(id, token): Observable<any> {
    const httpHeaders: HttpHeaders = new HttpHeaders({ token: token });
    return this.http.get(`${apiUrl}/bundle-purchase/${id}`, { headers: httpHeaders });
  }

  public getBundles(token): Observable<any> {
    const httpHeaders: HttpHeaders = new HttpHeaders({ token: token });
    return this.http.get(`${apiUrl}/bundles`, { headers: httpHeaders });
  }

  public getBundlesForAdmin(token, page?: number): Observable<any> {
    if (!page) page = 1;
    const httpHeaders: HttpHeaders = new HttpHeaders({ token: token });
    return this.http.get(`${apiUrl}/adminbundles?page=${page}`, { headers: httpHeaders });
  }

}
