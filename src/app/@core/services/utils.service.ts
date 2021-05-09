import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NbComponentStatus, NbGlobalLogicalPosition, NbToastrService } from '@nebular/theme';
import { ENMessage } from '../constants/messages/en';
import { NEMessage } from '../constants/messages/ne';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class UtilsService {
    constructor(private toastrService: NbToastrService, private router: Router, private authService: AuthService) {}

    showToast(statusType: string, message: string) {
        this.toastrService.show(statusType, this.translateMessage(Array.isArray(message) ? message[0] : message), { limit: 2, position: NbGlobalLogicalPosition.BOTTOM_START, status: <NbComponentStatus>statusType, destroyByClick: true, duration: 3000 });
    }

    navigateToLogin() {
        this.router.navigate(['/auth/login']);
    }

    translateMessage(message: string): string {
        return (this.authService.getUserLang()?.toUpperCase() ?? 'EN') === 'EN' ? ENMessage[message] : NEMessage[message] ?? message;
    }
}
