import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/@core/services/auth.service';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/map';

@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate {
    constructor(private router: Router, private authService: AuthService) {}

    canActivate(): Observable<boolean> | boolean {
        if (!this.authService.getAccessToken()) {
            this.router.navigate(['/auth/login']);
            return false;
        }
        return this.authService
            .auth()
            .map((res) => {
                if (res && res.success) {
                    if (res.data) {
                        this.authService.setUserData(res.data);
                        this.authService.setLogin();
                        return true;
                    }
                }
                this.authService.logoutUser();
                this.router.navigate(['/auth/login']);
                return false;
            })
            .first();
    }
}
