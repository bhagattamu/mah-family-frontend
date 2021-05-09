import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SUCCESS, WARNING } from 'src/app/@core/constants/toast.constant';
import { LoaderService, UtilsService } from 'src/app/@core/services';
import { AuthService } from 'src/app/@core/services/auth.service';

@Component({
    selector: 'app-family-information',
    templateUrl: './family-information.component.html'
})
export class FamilyInformationComponent implements OnInit {
    familyInfoForm: FormGroup;
    type: string;
    submitted: boolean;
    familyInformation: any;
    actionButtons: Array<any> = [
        {
            title: 'edit',
            active: false
        },
        {
            title: 'reset',
            active: true
        },
        {
            title: 'save',
            active: true
        },
        {
            title: 'cancel',
            active: true
        }
    ];

    constructor(private readonly fb: FormBuilder, private readonly authService: AuthService, private utilsService: UtilsService, public loaderService: LoaderService) {}

    ngOnInit(): void {
        this.buildFamilyInfoForm();
        this.getFamilyInformation();
        this.makeMenuActive('view');
    }

    buildFamilyInfoForm(): void {
        this.familyInfoForm = this.fb.group({
            familyName: ['', [Validators.required]],
            subFamilyName: [''],
            origin: ['']
        });
    }

    getFamilyInformation(): void {
        this.authService.getUserFamily().subscribe(
            (res) => {
                if (res && res.success && res.data) {
                    this.familyInformation = res.data;
                    this.patchForm();
                    this.authService.setLanguageInformationMenuStatus(true);
                } else {
                    this.editForm();
                    this.familyInfoForm.patchValue({
                        familyName: this.authService.getUserData().lastName
                    });
                    this.authService.setLanguageInformationMenuStatus(false);
                }
            },
            (err) => {
                this.authService.setLanguageInformationMenuStatus(false);
                this.editForm();
                this.familyInfoForm.patchValue({
                    familyName: this.authService.getUserData().lastName
                });
            }
        );
    }

    get FamilyInfoForm(): any {
        return this.familyInfoForm.controls;
    }

    patchForm(): void {
        this.familyInfoForm.patchValue({
            familyName: this.familyInformation?.familyName ?? this.authService.getUserData().lastName,
            subFamilyName: this.familyInformation?.subFamilyName,
            origin: this.familyInformation?.origin
        });
    }

    makeMenuActive(type: string): void {
        this.type = type;
        if (this.type === 'view') {
            this.familyInfoForm.disable();
            this.actionButtons = this.actionButtons.map((button) => {
                if (button.title === 'edit') {
                    button.active = true;
                } else {
                    button.active = false;
                }
                return button;
            });
        } else if (this.type === 'edit') {
            this.actionButtons = this.actionButtons.map((button) => {
                if (button.title === 'edit') {
                    button.active = false;
                } else {
                    button.active = true;
                }
                return button;
            });
        }
    }

    resetForm(): void {
        this.patchForm();
        this.submitted = false;
    }

    editForm(): void {
        this.type = 'edit';
        this.familyInfoForm.enable();
        this.makeMenuActive('edit');
    }

    cancelForm(): void {
        this.type = 'view';
        this.resetForm();
        this.familyInfoForm.disable();
        this.makeMenuActive('view');
    }

    getButtonActiveStatus(title: string): boolean {
        return this.actionButtons.find((button) => button.title === title).active;
    }

    onSubmit({ value, valid }): void {
        if (!valid) {
            this.submitted = true;
            return;
        }
        this.loaderService.startLoader();
        this.authService.createUserFamily(value).subscribe(
            (res) => {
                this.loaderService.stopLoader();
                if (res && res.success) {
                    this.familyInformation = res.data;
                    this.type = 'view';
                    this.submitted = false;
                    this.makeMenuActive(this.type);
                    this.authService.setLanguageInformationMenuStatus(true);
                    this.utilsService.showToast(SUCCESS, res.message[0]);
                } else {
                    this.loaderService.stopLoader();
                }
            },
            (err) => {
                this.utilsService.showToast(WARNING, err.message);
                this.loaderService.stopLoader();
            }
        );
    }
}
