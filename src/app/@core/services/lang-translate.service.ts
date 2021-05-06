import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { getTranslatedTitle, MenuItem } from '../constants/menu.constant';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class LangTranslateService {
    constructor(private authService: AuthService) {}

    private langChangeSubject = new BehaviorSubject<string>(this.authService.getUserLang());

    sendChangeRequest(lang: string): void {
        this.langChangeSubject.next(lang);
    }

    getCurrentLangRequest(): Observable<any> {
        return this.langChangeSubject.asObservable();
    }

    translateMenu(lang: string, menu: Array<MenuItem>): void {
        menu.forEach((menuItem: MenuItem) => {
            this.translateMenuTitle(lang, menuItem);
        });
    }

    translateMenuTitle(lang: string, menuItem: MenuItem): void {
        menuItem.title = getTranslatedTitle(lang, menuItem.key);
        if (menuItem.children?.length) {
            this.translateMenu(lang, menuItem.children);
        }
    }

    translateTab(lang: string, tabs: Array<any>): void {
        tabs.forEach((menuItem: any) => {
            this.translateTabTitle(lang, menuItem);
        });
    }

    translateTabTitle(lang: string, tabItem: any): void {
        tabItem.title = getTranslatedTitle(lang, tabItem.key);
    }
}
