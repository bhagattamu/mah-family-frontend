import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoaderService {
    private loader = new BehaviorSubject<boolean>(false);

    startLoader(): void {
        this.loader.next(true);
    }

    stopLoader(): void {
        this.loader.next(false);
    }

    get getLoaderSubject(): Observable<boolean> {
        return this.loader.asObservable();
    }
}
