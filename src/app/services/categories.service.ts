import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private http: HttpClient) {

  }

  public getCategories(): Observable<any> {
    return this.http.get<any>(`${apiUrl}/categories`);
  }

  public getJsonCategories(): Observable<any> {
    return this.http.get<any>(`${apiUrl}/jsoncategories`);
  }

  public getJsonAdCategories(): Observable<any> {
    return this.http.get<any>(`${apiUrl}/jsonadcategories`);
  }

  public getAdCategories(): Observable<any> {
    return this.http.get<any>(`${apiUrl}/adcategories`);
  }

  public createCategory(data): Observable<any> {
    /*pHeaders = new HttpHeaders({
      token: token
    });*/
    //return this.http.post(`${apiUrl}/products`, data, { headers: httpHeaders });
    return this.http.post(`${apiUrl}/categories`, data);
  }

  public updateCategory(id, data): Observable<any> {
    return this.http.put(`${apiUrl}/categories/${id}`, data);
  }

  public deleteCategory(id): Observable<any> {
    return this.http.delete(`${apiUrl}/categories/${id}`);
  }
}
