import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserModuleMessages } from 'src/app/@core/constants/messages/user.constant';
import { SUCCESS, WARNING } from 'src/app/@core/constants/toast.constant';
import { LoaderService, UtilsService } from 'src/app/@core/services';
import { AuthService } from 'src/app/@core/services/auth.service';

@Component({
    templateUrl: './recovery-code.component.html'
})
export class RecoveryCodeComponent implements OnInit {
    recoveryCodeForm: FormGroup;
    resendCode: boolean;
    userId: string;
    submitted: boolean;
    constructor(private fb: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute, private authService: AuthService, private utilsService: UtilsService, public loaderService: LoaderService) {
        this.userId = this.activatedRoute.snapshot.params.userId;
    }

    ngOnInit(): void {
        this.checkForValidRoute();
        this.buildRecoveryCodeForm();
    }

    checkForValidRoute(): void {
        if (this.userId) {
            this.loaderService.startLoader();
            this.authService.isRequestRecoveryRouteValid(this.userId).subscribe(
                (res) => {
                    this.loaderService.stopLoader();
                    if (!(res && res.success && res.data.valid)) {
                        this.utilsService.showToast(WARNING, UserModuleMessages.ROUTE_ACCESS_FORBIDDEN);
                        this.utilsService.navigateToLogin();
                    }
                },
                (err) => {
                    this.loaderService.stopLoader();
                    this.utilsService.showToast(WARNING, err.message);
                    this.utilsService.navigateToLogin();
                }
            );
        } else {
            this.utilsService.showToast(WARNING, UserModuleMessages.ROUTE_ACCESS_FORBIDDEN);
            this.utilsService.navigateToLogin();
        }
    }

    buildRecoveryCodeForm(): void {
        this.recoveryCodeForm = this.fb.group({
            recoveryCode: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]]
        });
    }

    get RecoveryCodeForm() {
        return this.recoveryCodeForm.controls;
    }

    onResendCode(): void {
        this.resendCode = true;
        this.loaderService.startLoader();
        this.authService.resendRequestRecovery(this.userId).subscribe(
            (res) => {
                this.loaderService.stopLoader();
                if (res && res.success) {
                    this.utilsService.showToast(SUCCESS, res.message);
                } else {
                    this.utilsService.showToast(WARNING, UserModuleMessages.RECOVERY_CODE_SEND_FAILED);
                    this.utilsService.navigateToLogin();
                }
            },
            (err) => {
                this.loaderService.stopLoader();
                this.utilsService.showToast(WARNING, UserModuleMessages.RECOVERY_CODE_SEND_FAILED);
                this.utilsService.navigateToLogin();
            }
        );
    }

    onSubmitRecoveryCodeForm({ valid, value }): void {
        if (!valid) {
            this.submitted = true;
            return;
        }
        this.loaderService.startLoader();
        value.user = this.userId;
        this.authService.getResetPasswordRouteByCode(value).subscribe(
            (res) => {
                this.loaderService.stopLoader();
                if (res && res.success) {
                    this.router.navigateByUrl(res.data.resetUrl);
                } else {
                    this.utilsService.showToast(WARNING, UserModuleMessages.RECOVERY_CODE_EXPIRED);
                }
            },
            (err) => {
                this.loaderService.stopLoader();
                this.utilsService.showToast(WARNING, err.message);
            }
        );
    }
}
