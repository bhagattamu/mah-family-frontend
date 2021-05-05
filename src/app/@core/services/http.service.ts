import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const API_HOST = environment.API_HOST;
@Injectable({ providedIn: 'root' })
export class HttpService {
    constructor(private http: HttpClient) {}

    get(URL: string, query?: any, formType?: any): Observable<any> {
        return this.http.get(API_HOST + URL, this.getHeaderWithParams(query, formType)).pipe(catchError(this.errorHandle));
    }

    post(URL: string, body?: any, formData?: boolean): Observable<any> {
        return this.http.post(API_HOST + URL, body, this.getHeader(formData)).pipe(catchError(this.errorHandle));
    }

    put(URL: string, body?: any, formData?: boolean): Observable<any> {
        return this.http.put(API_HOST + URL, body, this.getHeader(formData)).pipe(catchError(this.errorHandle));
    }

    delete(URL: string, query?: any): Observable<any> {
        return this.http.delete(API_HOST + URL, this.getHeaderWithParams(query)).pipe(catchError(this.errorHandle));
    }

    getHeader(formData?: boolean): any {
        if (formData) {
            return this.getFormDataHeader();
        }
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
            withCredentials: true
        };
    }

    getFormDataHeader(): any {
        return { headers: new HttpHeaders({}) };
    }

    getBlobHeader(): any {
        return { responseType: 'blob' };
    }

    getTextHeader(): any {
        return { responseType: 'text' };
    }

    getHeaderWithParams(paramsData = {}, formType?: any): any {
        let options: any;
        let params = new HttpParams();
        for (const param of Object.keys(paramsData)) {
            params = params.append(param, paramsData[param]);
        }
        if (formType && formType.formType === 'text') {
            options = this.getTextHeader();
        } else if (formType && formType.formType === 'blob') {
            options = this.getBlobHeader();
        } else {
            options = this.getHeader(false);
        }
        options.params = params;
        return options;
    }

    errorHandle(error: any): any {
        if (error.error && error.error.statusCode) {
            return throwError(error.error);
        } else {
            let errorMessage = '';
            if (error.error instanceof ErrorEvent) {
                errorMessage = error.error.error;
            } else {
                errorMessage = `Error Code: ${error.status}\nMessage: ${error.error}`;
            }
            return throwError(errorMessage);
        }
    }
}
