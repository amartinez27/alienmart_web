import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const apiUrl = environment.apiUrl;

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    constructor(private http: HttpClient) { }

    public getProducts(page: number, limit: number, query?: string, cid?: number, sale?: boolean): Observable<any> {
        let route = `${apiUrl}/products?page=${page}&limit=${limit}`;
        route = query ? `${route}&q=${query}` : route;
        route = cid ? `${route}&c=${cid}` : route;
        route = sale ? `${route}&p=${sale}` : route;
        return this.http.get<any>(route);
    }

    public createProduct(data, token): Observable<any> {
        const httpHeaders: HttpHeaders = new HttpHeaders({ token: token });
        return this.http.post(`${apiUrl}/products`, data, { headers: httpHeaders });
    }

    public updateProduct(pid, data, token): Observable<any> {
        const httpHeaders: HttpHeaders = new HttpHeaders({ token: token });
        return this.http.put(`${apiUrl}/products/${pid}`, data, { headers: httpHeaders });
    }

    public createProductQuestion(pid, data, token): Observable<any> {
        const httpHeaders: HttpHeaders = new HttpHeaders({ token: token });
        return this.http.post(`${apiUrl}/question/${pid}`, data, { headers: httpHeaders });
    }

    public updateProductQuestion(qid, data, token): Observable<any> {
        const httpHeaders: HttpHeaders = new HttpHeaders({ token: token });
        return this.http.put(`${apiUrl}/question/${qid}`, data, { headers: httpHeaders });
    }

    public approveProductQuestion(qid, token): Observable<any> {
        const httpHeaders: HttpHeaders = new HttpHeaders({ token: token });
        return this.http.put(`${apiUrl}/approve/${qid}`, {}, { headers: httpHeaders });
    }

    public getProductQuestions(pid, token): Observable<any> {
        const httpHeaders: HttpHeaders = new HttpHeaders({ token: token });
        return this.http.get(`${apiUrl}/questions/${pid}`, { headers: httpHeaders });
    }

    public deleteProductQuestion(pid, token): Observable<any> {
        const httpHeaders: HttpHeaders = new HttpHeaders({ token: token });
        return this.http.delete(`${apiUrl}/question/${pid}`, { headers: httpHeaders });
    }

    public createProductRating(pid, data, token): Observable<any> {
        const httpHeaders: HttpHeaders = new HttpHeaders({ token: token });
        return this.http.post(`${apiUrl}/ratings/${pid}`, data, { headers: httpHeaders });
    }

    public deleteProduct(pid, token): Observable<any> {
        const httpHeaders: HttpHeaders = new HttpHeaders({ token: token });
        return this.http.delete(`${apiUrl}/products/${pid}`, { headers: httpHeaders });
    }

    public getProductsByUserId(user_id: number): Observable<any> {
        return this.http.get(`${apiUrl}/products/users/${user_id}`);
    }

    public getProductById(prod_id): Observable<any> {
        return this.http.get(`${apiUrl}/products/${prod_id}`);
    }

    public getProductsForLoggedUser(page: number, limit: number, token, query?: string, cid?: number, sale?: boolean): Observable<any> {
        let route = `${apiUrl}/products?page=${page}&limit=${limit}`;
        route = query ? `${route}&q=${query}` : route;
        route = cid ? `${route}&c=${cid}` : route;
        route = sale ? `${route}&p=${sale}` : route;
        const httpHeaders: HttpHeaders = new HttpHeaders({ token: token });
        return this.http.get<any>(route, { headers: httpHeaders });
    }

    public getProductByIdForLoggedUser(prod_id, token): Observable<any> {
        const httpHeaders: HttpHeaders = new HttpHeaders({ token: token });
        return this.http.get(`${apiUrl}/products/${prod_id}`, { headers: httpHeaders });
    }

    private handleError(error) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            // Get client-side error
            errorMessage = error.error.message;
        } else {
            // Get server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        window.alert(errorMessage);
        return throwError(errorMessage);
    }




    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        return [year, month, day].join('-');
    }
}
