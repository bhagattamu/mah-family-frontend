import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { UserModuleMessages } from 'src/app/@core/constants/messages/user.constant';
import { SUCCESS, WARNING } from 'src/app/@core/constants/toast.constant';
import { LoaderService, UtilsService } from 'src/app/@core/services';
import { AuthService } from 'src/app/@core/services/auth.service';

@Component({
    selector: 'app-user-change-password',
    templateUrl: './change-password.component.html'
})
export class UserChangePasswordComponent implements OnInit {
    submitted: boolean;
    changePasswordFormGroup: FormGroup;
    constructor(private readonly ref: NbDialogRef<UserChangePasswordComponent>, private readonly fb: FormBuilder, private readonly authService: AuthService, private readonly utilsService: UtilsService, public loaderService: LoaderService) {}

    ngOnInit(): void {
        this.buildChangePasswordFormGroup();
    }

    buildChangePasswordFormGroup(): void {
        this.changePasswordFormGroup = this.fb.group({
            currentPassword: ['', [Validators.required]],
            password: ['', [Validators.required]],
            confirmPassword: ['', [Validators.required]]
        });
    }

    get ChangePasswordFormGroup() {
        return this, this.changePasswordFormGroup.controls;
    }

    onChangePassword(): void {
        const passwordMismatch = this.changePasswordFormGroup.get('password').value !== this.changePasswordFormGroup.get('confirmPassword').value;
        if (passwordMismatch) {
            this.changePasswordFormGroup.get('confirmPassword').setErrors({ passwordMismatch });
        } else {
            this.changePasswordFormGroup.get('confirmPassword').setErrors(null);
        }
    }

    onSubmit({ valid, value }): void {
        if (!valid) {
            this.submitted = true;
            return;
        }
        this.loaderService.startLoader();
        this.authService.changePassword(value).subscribe(
            (res) => {
                this.loaderService.stopLoader();
                if (res && res.success) {
                    this.ref.close(res);
                    this.utilsService.showToast(SUCCESS, res.message);
                } else {
                    this.utilsService.showToast(WARNING, UserModuleMessages.PASSWORD_CHANGED_FAILED);
                }
            },
            (err) => {
                this.loaderService.stopLoader();
                this.utilsService.showToast(WARNING, err.message);
            }
        );
    }

    closeDialog() {
        this.ref.close();
    }
}
