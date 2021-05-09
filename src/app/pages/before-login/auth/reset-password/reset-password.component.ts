import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserModuleMessages } from 'src/app/@core/constants/messages/user.constant';
import { SUCCESS, WARNING } from 'src/app/@core/constants/toast.constant';
import { LoaderService, LocalStorageService, UtilsService } from 'src/app/@core/services';
import { AuthService } from 'src/app/@core/services/auth.service';

@Component({
    templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
    submitted: boolean;
    userId: string;
    recoveryToken: string;
    resetPasswordForm: FormGroup;

    constructor(private activatedRoute: ActivatedRoute, private utilsService: UtilsService, private authService: AuthService, private fb: FormBuilder, private localStorageService: LocalStorageService, private router: Router, public readonly loaderService: LoaderService) {
        const queries = this.activatedRoute.snapshot.queryParams;
        const { u, rt } = queries;
        if (!u || !rt) {
            this.utilsService.showToast(WARNING, UserModuleMessages.ROUTE_ACCESS_FORBIDDEN);
            this.utilsService.navigateToLogin();
        } else {
            this.userId = u;
            this.recoveryToken = rt;
        }
    }

    ngOnInit(): void {
        this.checkForValidRoute();
        this.buildResetPasswordForm();
    }

    buildResetPasswordForm(): void {
        this.resetPasswordForm = this.fb.group({
            password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
            confirmPassword: ['', [Validators.required]]
        });
    }

    get ResetPasswordForm(): any {
        return this.resetPasswordForm.controls;
    }

    checkForValidRoute(): void {
        this.authService.isResetPasswordRouteValid(this.recoveryToken, this.userId).subscribe(
            (res) => {
                if (!(res && res.success && res.data.valid)) {
                    this.utilsService.showToast(WARNING, UserModuleMessages.ROUTE_ACCESS_FORBIDDEN);
                    this.utilsService.navigateToLogin();
                }
            },
            (err) => {
                this.utilsService.showToast(WARNING, UserModuleMessages.ROUTE_ACCESS_FORBIDDEN);
                this.utilsService.navigateToLogin();
            }
        );
    }

    onChangePassword(): void {
        const passwordMismatch = this.resetPasswordForm.get('password').value !== this.resetPasswordForm.get('confirmPassword').value;
        if (passwordMismatch) {
            this.resetPasswordForm.get('confirmPassword').setErrors({ passwordMismatch });
        } else {
            this.resetPasswordForm.get('confirmPassword').setErrors(null);
        }
    }

    onSubmitResetPasswordForm({ value, valid }): void {
        if (!valid) {
            this.submitted = true;
            return;
        }
        value.key = this.recoveryToken;
        value.user = this.userId;
        this.loaderService.startLoader();
        this.authService.resetPassword(value).subscribe(
            (res) => {
                this.loaderService.stopLoader();
                if (res && res.success) {
                    this.localStorageService.setItem('accessToken', res.data.accessToken);
                    this.localStorageService.setItem('uData', res.data);
                    this.router.navigate(['/dashboard']);
                    this.utilsService.showToast(SUCCESS, res.message);
                } else {
                    this.utilsService.showToast(WARNING, UserModuleMessages.PASSWORD_CHANGED_FAILED);
                    this.utilsService.navigateToLogin();
                }
            },
            (err) => {
                this.loaderService.stopLoader();
                if (err.statusCode !== 400) {
                    this.utilsService.showToast(WARNING, err.message);
                    this.utilsService.navigateToLogin();
                } else {
                    this.utilsService.showToast(WARNING, err.message);
                }
            }
        );
    }
}
