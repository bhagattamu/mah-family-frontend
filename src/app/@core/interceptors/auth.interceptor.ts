import { Injectable } from '@angular/core';
import { HttpHandler, HttpEvent, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/@core/services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    refreshingAccessToken: boolean;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    constructor(private authService: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.authService.getAccessToken()) {
            req = this.addToken(req, this.authService.getAccessToken());
        }
        return next.handle(req).pipe(
            catchError(
                (error: HttpErrorResponse): Observable<any> => {
                    if (error instanceof HttpErrorResponse && error.status === 401) {
                        if (req.url.includes('refresh-token')) {
                            this.authService.logoutFromFrontend();
                        }
                        return this.handle401Error(req, next);
                    }
                    return throwError(error);
                }
            )
        );
    }

    private addToken(request: HttpRequest<any>, token: string): any {
        return request.clone({
            setHeaders: {
                Authorization: `bearer ${token}`
            }
        });
    }

    private handle401Error(request: HttpRequest<any>, next: HttpHandler): any {
        if (!this.refreshingAccessToken) {
            this.refreshingAccessToken = true;
            this.refreshTokenSubject.next(null);
            return this.authService.getNewAccessToken(this.authService.getAccessToken()).pipe(
                switchMap((res: any) => {
                    if (res && res.success) {
                        const accessToken = res.data.accessToken;
                        this.refreshingAccessToken = false;
                        this.authService.setAccessToken(accessToken);
                        this.refreshTokenSubject.next(accessToken);
                        return next.handle(this.addToken(request, accessToken));
                    } else {
                        throw new Error('REFRESH_FAILED');
                    }
                }),
                catchError((err) => {
                    if (err.message === 'REFRESH_FAILED') {
                        localStorage.clear();
                        this.authService.logoutUser();
                        return '';
                    }
                    return next.handle(request.clone());
                })
            );
        } else {
            return this.refreshTokenSubject.pipe(
                filter((token) => token != null),
                take(1),
                switchMap((jwt) => {
                    return next.handle(this.addToken(request, jwt));
                })
            );
        }
    }
}
