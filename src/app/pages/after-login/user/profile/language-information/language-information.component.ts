import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/@core/services/auth.service';

@Component({
    selector: 'app-language-information',
    templateUrl: './language-information.component.html'
})
export class LanguageInformationComponent implements OnInit {
    languageInfoForm: FormGroup;
    type: string;
    submitted: boolean;
    languageInformation: any;
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

    constructor(private readonly fb: FormBuilder, private readonly authService: AuthService) {}

    ngOnInit(): void {
        console.log('in');
        this.buildLanguageInfoForm();
        this.getLanguageInformation();
        this.makeMenuActive('view');
    }

    buildLanguageInfoForm(): void {
        this.languageInfoForm = this.fb.group({
            motherLanguage: ['', [Validators.required]],
            nationalLanguage: ['', [Validators.required]],
            others: this.fb.array([''])
        });
    }

    get others(): FormArray {
        return this.languageInfoForm.get('others') as FormArray;
    }

    getLanguageInformation(): void {
        this.authService.getUserFamily().subscribe(
            (res) => {
                if (res && res.success && res.data) {
                    this.languageInformation = this.buildLanguageInfo(res.data);
                    if (this.languageInformation) {
                        this.patchForm();
                    }
                } else {
                    this.editForm();
                }
            },
            (err) => {
                this.editForm();
            }
        );
    }

    buildLanguageInfo(data: any): any {
        if (data.language.motherLanguage && data.language.nationalLanguage) {
            return {
                motherLanguage: data.language.motherLanguage.languageName,
                nationalLanguage: data.language.nationalLanguage.languageName,
                others: data.others
            };
        } else {
            this.editForm();
        }
    }

    patchForm(): void {
        this.languageInfoForm.patchValue({
            motherLanguage: this.languageInformation?.motherLanguage ?? '',
            nationalLanguage: this.languageInformation?.nationalLanguage ?? '',
            others: this.languageInformation?.others ?? ['']
        });
    }

    makeMenuActive(type: string): void {
        this.type = type;
        if (this.type === 'view') {
            this.languageInfoForm.disable();
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
        this.languageInfoForm.enable();
        this.makeMenuActive('edit');
    }

    cancelForm(): void {
        this.type = 'view';
        this.languageInfoForm.disable();
        this.makeMenuActive('view');
    }

    getButtonActiveStatus(title: string): boolean {
        return this.actionButtons.find((button) => button.title === title).active;
    }

    onSubmit({ valid, value }): void {
        this.submitted = true;
        if (!valid) {
            return;
        }
        this.authService.createUserLanguage(value).subscribe((res) => {
            if (res && res.success && res.data) {
                this.languageInformation = value;
                this.type = 'view';
                this.submitted = false;
                this.makeMenuActive(this.type);
            }
        });
    }
}
