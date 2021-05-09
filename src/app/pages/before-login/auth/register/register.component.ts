import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SUCCESS, WARNING } from 'src/app/@core/constants/toast.constant';
import { LoaderService, UtilsService } from 'src/app/@core/services';
import { AuthService } from 'src/app/@core/services/auth.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    submitted: boolean;

    constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, public readonly loaderService: LoaderService, private readonly utilsService: UtilsService) {}

    ngOnInit(): void {
        this.buildRegisterForm();
    }

    buildRegisterForm(): void {
        this.registerForm = this.fb.group({
            firstName: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', [Validators.required]]
        });
    }

    get RegisterFormGroup() {
        return this.registerForm.controls;
    }

    registerUser({ value, valid }): void {
        if (!valid) {
            this.submitted = true;
            return;
        }
        this.loaderService.startLoader();
        this.authService.registerUser(value).subscribe(
            (res) => {
                this.loaderService.stopLoader();
                if (res && res.success) {
                    this.router.navigate(['/auth/thank-you']);
                    this.utilsService.showToast(SUCCESS, res.message);
                }
            },
            (err) => {
                this.utilsService.showToast(WARNING, err.message);
                this.loaderService.stopLoader();
            }
        );
    }
}
