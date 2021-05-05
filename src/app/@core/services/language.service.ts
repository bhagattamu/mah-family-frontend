import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '.';
import { URL_CONSTANT } from '../constants/url.constant';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    constructor(private readonly httpService: HttpService) {}

    createLanguage(createLanguageDto: any): Observable<any> {
        return this.httpService.post(URL_CONSTANT.LANGUAGE_BASE, createLanguageDto);
    }

    searchLanguageByName(query: any): Observable<any> {
        return this.httpService.get(URL_CONSTANT.LANGUAGE_BASE + '/search', query);
    }

    getAllForkedLanguages(): Observable<any> {
        return this.httpService.get(URL_CONSTANT.LANGUAGE_BASE + '/forked');
    }
}
