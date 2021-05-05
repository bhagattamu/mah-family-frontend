import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LangTranslateService {
    private langChangeSubject = new Subject<string>();

    sendChangeRequest(lang: string): void {
        this.langChangeSubject.next(lang);
    }

    getCurrentLangRequest(): Observable<any> {
        return this.langChangeSubject.asObservable();
    }
}
