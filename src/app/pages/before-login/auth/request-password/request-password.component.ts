import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SUCCESS, WARNING } from 'src/app/@core/constants/toast.constant';
import { LoaderService, UtilsService } from 'src/app/@core/services';
import { AuthService } from 'src/app/@core/services/auth.service';

@Component({
    templateUrl: './request-password.component.html'
})
export class RequestPasswordComponent implements OnInit {
    requestPasswordFormGroup: FormGroup;
    submitted: boolean;

    constructor(private fb: FormBuilder, private router: Router, private authService: AuthService, private utilsService: UtilsService, public readonly loaderService: LoaderService) {}

    ngOnInit(): void {
        this.requestPasswordFormGroup = this.fb.group({
            emailOrPhone: ['', [Validators.required, Validators.email]]
        });
    }

    get RequestPasswordFormGroup() {
        return this.requestPasswordFormGroup.controls;
    }

    onSubmitRequestPassword({ valid, value }): void {
        if (!valid) {
            this.submitted = true;
            return;
        }
        this.loaderService.startLoader();
        this.authService.requestPassword(value).subscribe(
            (res) => {
                this.loaderService.stopLoader();
                if (res && res.success) {
                    this.router.navigate([`/auth/recovery-code/${res.data.id}`]);
                    this.utilsService.showToast(SUCCESS, res.message[0]);
                } else {
                    this.utilsService.showToast(WARNING, 'USER_NOT_FOUND');
                }
            },
            (err) => {
                this.loaderService.stopLoader();
                this.utilsService.showToast(WARNING, err.message);
            }
        );
    }
}
