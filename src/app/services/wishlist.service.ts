import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  constructor(private http: HttpClient) { }

  public getUsersWishlist(token): Observable<any> {
    const httpHeaders: HttpHeaders = new HttpHeaders({ token: token });
    return this.http.get<any>(`${apiUrl}/wishlist`, { headers: httpHeaders });
  }

  public createLike(pid, token): Observable<any> {
    const httpHeaders: HttpHeaders = new HttpHeaders({ token: token });
    return this.http.post(`${apiUrl}/wishlist/${pid}`, {}, { headers: httpHeaders });
  }

  public createAdLike(aid, token): Observable<any> {
    const httpHeaders: HttpHeaders = new HttpHeaders({ token: token });
    return this.http.post(`${apiUrl}/adwishlist/${aid}`, {}, { headers: httpHeaders });
  }

  public deleteLike(pid, token): Observable<any> {
    const httpHeaders: HttpHeaders = new HttpHeaders({ token: token });
    return this.http.delete(`${apiUrl}/wishlist/${pid}`, { headers: httpHeaders });
  }

  public deleteAdLike(aid, token): Observable<any> {
    const httpHeaders: HttpHeaders = new HttpHeaders({ token: token });
    return this.http.delete(`${apiUrl}/adwishlist/${aid}`, { headers: httpHeaders });
  }

  public deleteUsersWishlist(token): Observable<any> {
    const httpHeaders: HttpHeaders = new HttpHeaders({ token: token });
    return this.http.delete(`${apiUrl}/wishlist`, { headers: httpHeaders });
  }

}
