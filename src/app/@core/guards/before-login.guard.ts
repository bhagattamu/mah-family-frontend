import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/first';
import { AuthService } from 'src/app/@core/services/auth.service';

@Injectable({ providedIn: 'root' })
export class BeforeLoginGuard implements CanActivate {
    constructor(private router: Router, private authService: AuthService) {}

    canActivate(): Observable<boolean> | boolean {
        if (this.authService.getAccessToken()) {
            return this.authService
                .auth()
                .map((res) => {
                    if (res && res.success) {
                        if (res.data) {
                            this.authService.setLogin();
                            this.router.navigate(['/dashboard']);
                            return false;
                        }
                    }
                    return true;
                })
                .first();
        } else {
            return true;
        }
    }
}
