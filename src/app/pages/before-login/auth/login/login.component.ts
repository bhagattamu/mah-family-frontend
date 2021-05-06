import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SUCCESS, WARNING } from 'src/app/@core/constants/toast.constant';
import { LocalStorageService, UtilsService, LoaderService } from 'src/app/@core/services';
import { AuthService } from 'src/app/@core/services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    eyeOpen: boolean;
    submitted: boolean;

    constructor(private fb: FormBuilder, private router: Router, private authService: AuthService, private localStorageService: LocalStorageService, public loaderService: LoaderService, private utilsService: UtilsService) {}

    ngOnInit(): void {
        this.buildLoginForm();
    }

    buildLoginForm() {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]]
        });
    }

    get LoginFormGroup() {
        return this.loginForm.controls;
    }

    toggleEye(): void {
        this.eyeOpen = !this.eyeOpen;
    }

    onLogin({ value, valid }): void {
        if (!valid) {
            this.submitted = true;
            return;
        }
        this.loaderService.startLoader();
        this.authService.loginUser(value).subscribe(
            (res) => {
                this.loaderService.stopLoader();
                if (res && res.success) {
                    this.authService.setAccessToken(res.data.accessToken);
                    this.authService.setUserData(res.data);
                    window.location.reload();
                } else {
                    this.utilsService.showToast(WARNING, 'Failed');
                }
            },
            (err) => {
                this.utilsService.showToast(WARNING, 'Login Failed');
                this.loaderService.stopLoader();
            }
        );
    }
}
