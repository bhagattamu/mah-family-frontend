import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SUCCESS, WARNING } from 'src/app/@core/constants/toast.constant';
import { UtilsService } from 'src/app/@core/services';
import { AuthService } from 'src/app/@core/services/auth.service';

@Component({
    templateUrl: './recovery-code.component.html'
})
export class RecoveryCodeComponent implements OnInit {
    recoveryCodeForm: FormGroup;
    resendCode: boolean;
    userId: string;
    constructor(private fb: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute, private authService: AuthService, private utilsService: UtilsService) {
        this.userId = this.activatedRoute.snapshot.params.userId;
    }

    ngOnInit(): void {
        this.checkForValidRoute();
        this.buildRecoveryCodeForm();
    }

    checkForValidRoute(): void {
        if (this.userId) {
            this.authService.isRequestRecoveryRouteValid(this.userId).subscribe(
                (res) => {
                    if (!(res && res.success && res.data.valid)) {
                        this.utilsService.showToast(WARNING, 'FORBIDDEN_ROUTE');
                        this.utilsService.navigateToLogin();
                    }
                },
                (err) => {
                    this.utilsService.showToast(WARNING, 'FORBIDDEN_ROUTE');
                    this.utilsService.navigateToLogin();
                }
            );
        } else {
            this.utilsService.showToast(WARNING, 'FORBIDDEN_ROUTE');
            this.utilsService.navigateToLogin();
        }
    }

    buildRecoveryCodeForm(): void {
        this.recoveryCodeForm = this.fb.group({
            recoveryCode: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]]
        });
    }

    onResendCode(): void {
        this.resendCode = true;
        this.authService.resendRequestRecovery(this.userId).subscribe(
            (res) => {
                if (res && res.success) {
                    this.utilsService.showToast(SUCCESS, 'CODE_SENT_SUCCESSFULLY');
                } else {
                    this.utilsService.showToast(WARNING, 'FAIL_TO_SENT_CODE_TRY_AGAIN_LATER');
                    this.utilsService.navigateToLogin();
                }
            },
            (err) => {
                this.utilsService.showToast(WARNING, 'FAIL_TO_SENT_CODE_TRY_AGAIN_LATER');
                this.utilsService.navigateToLogin();
            }
        );
        console.log('resending code');
    }

    onSubmitRecoveryCodeForm({ valid, value }): void {
        if (!valid) {
            return;
        }
        value.user = this.userId;
        this.authService.getResetPasswordRouteByCode(value).subscribe(
            (res) => {
                if (res && res.success) {
                    this.router.navigateByUrl(res.data.resetUrl);
                } else {
                    this.utilsService.showToast(WARNING, 'INVALID_CODE');
                }
            },
            (err) => {
                this.utilsService.showToast(WARNING, 'INVALID_CODE');
            }
        );
        console.log('Submitted', value);
    }
}
