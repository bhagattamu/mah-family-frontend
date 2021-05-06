import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
    constructor(private readonly authService: AuthService) {}

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
        const definedRole = route.data.role;
        const currentUser = this.authService.getUserData();
        console.log('Role guard', currentUser);
        if (currentUser && currentUser.roles && currentUser.roles.some((role: string) => definedRole.includes(role))) {
            return true;
        }
        return false;
    }
}
