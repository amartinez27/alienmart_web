import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class FeaturedTypesService {

  constructor(private http: HttpClient) { }

  public getFeaturedTypes(): Observable<any> {
    return this.http.get<any>(`${apiUrl}/featured_types`);
  }

  public getFeaturedBundles(): Observable<any> {
    return this.http.get<any>(`${apiUrl}/ad-bundles`);
  }
}
