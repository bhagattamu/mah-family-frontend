import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
    constructor(private readonly authService: AuthService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
        const definedRole = route.data.role;
        const autoPasswordValidation = route.data.autoPasswordValidation;
        const currentUser = this.authService.getUserData();
        if (currentUser && (!autoPasswordValidation || (autoPasswordValidation && !currentUser.autoPassword)) && currentUser.roles && currentUser.roles.some((role: string) => definedRole.includes(role))) {
            return true;
        }
        this.router.navigate(['/user/profile']);
        return false;
    }
}
