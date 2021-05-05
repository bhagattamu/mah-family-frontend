import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NbComponentStatus, NbGlobalLogicalPosition, NbToastrService } from '@nebular/theme';

@Injectable({ providedIn: 'root' })
export class UtilsService {
    constructor(private toastrService: NbToastrService, private router: Router) {}

    showToast(statusType: string, message: string) {
        this.toastrService.show(statusType, message, { limit: 2, position: NbGlobalLogicalPosition.BOTTOM_START, status: <NbComponentStatus>statusType, destroyByClick: true });
    }

    navigateToLogin() {
        this.router.navigate(['/auth/login']);
    }
}
