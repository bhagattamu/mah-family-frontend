import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogService } from '@nebular/theme';
import { SUCCESS, WARNING } from 'src/app/@core/constants/toast.constant';
import { LoaderService, UtilsService } from 'src/app/@core/services';
import { AuthService } from 'src/app/@core/services/auth.service';
import { environment } from 'src/environments/environment';
import { ViewPictureComponent } from '../user-picture/view-picture/view-picture.component';

@Component({
    selector: 'app-basic-information',
    templateUrl: './basic-information.component.html'
})
export class BasicInformationComponent implements OnInit {
    basicInfoForm: FormGroup;
    type: string;
    submitted: boolean;
    basicInformation: any;
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
    imageURL: any;

    constructor(private readonly fb: FormBuilder, private readonly dialogService: NbDialogService, private readonly authService: AuthService, public loaderService: LoaderService, private utilsService: UtilsService) {}

    ngOnInit(): void {
        this.getBasicInformation();
        this.buildBasicInfoForm();
        this.makeMenuActive('view');
    }

    buildBasicInfoForm(): void {
        this.basicInfoForm = this.fb.group({
            firstName: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', [Validators.required]],
            userPicture: ['']
        });
    }

    getBasicInformation(): void {
        this.authService.getUser().subscribe((res) => {
            this.basicInformation = res.data;
            this.patchForm();
            this.imageURL = res.data.profileImageURL ? `${environment.API_HOST}/files/user-picture/${res.data.id}/${res.data.profileImageURL}` : '/assets/images/subjects/default-user-image.png';
        });
    }

    get BasicInfoForm(): any {
        return this.basicInfoForm.controls;
    }

    patchForm(): void {
        this.basicInfoForm.patchValue({
            firstName: this.basicInformation?.firstName,
            lastName: this.basicInformation?.lastName,
            email: this.basicInformation?.email,
            phone: this.basicInformation?.phone,
            userPicture: null
        });
    }

    onNewImage(event): void {
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            this.basicInfoForm.patchValue({
                userPicture: file
            });
            const reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = (e) => {
                this.imageURL = e.target.result;
            };
        }
    }

    makeMenuActive(type: string): void {
        this.type = type;
        if (this.type === 'view') {
            this.basicInfoForm.disable();
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
        this.imageURL = this.basicInformation.profileImageURL ? `${environment.API_HOST}/files/user-picture/${this.basicInformation.id}/${this.basicInformation.profileImageURL}` : '/assets/images/subjects/default-user-image.png';
        this.submitted = false;
    }

    editForm(): void {
        this.type = 'edit';
        this.basicInfoForm.enable();
        this.makeMenuActive('edit');
    }

    cancelForm(): void {
        this.type = 'view';
        this.resetForm();
        this.basicInfoForm.disable();
        this.makeMenuActive('view');
        this.imageURL = this.basicInformation.profileImageURL ? `${environment.API_HOST}/files/user-picture/${this.basicInformation.id}/${this.basicInformation.profileImageURL}` : '/assets/images/subjects/default-user-image.png';
    }

    getButtonActiveStatus(title: string): boolean {
        return this.actionButtons.find((button) => button.title === title).active;
    }

    openImage(picture: string): void {
        if (this.type === 'view') {
            this.dialogService.open(ViewPictureComponent, { context: { imageURL: picture } });
        }
    }

    onSubmit({ value, valid }): void {
        if (!valid) {
            this.submitted = true;
            return;
        }
        this.loaderService.startLoader();
        let formData: any;
        let hasFormData: boolean;
        if (this.BasicInfoForm.userPicture.value) {
            hasFormData = true;
            formData = new FormData();
            for (const property of Object.keys(this.BasicInfoForm)) {
                formData.append(property, this.BasicInfoForm[property].value);
            }
        } else {
            hasFormData = false;
            formData = { ...value };
        }

        this.authService.updateUserBasicInfo(formData, hasFormData).subscribe(
            (res) => {
                this.loaderService.stopLoader();
                if (res && res.success) {
                    this.submitted = false;
                    this.authService.setUserData({ ...this.authService.getUserData(), ...res.data });
                    this.basicInformation = res.data;
                    this.type = 'view';
                    this.submitted = false;
                    this.makeMenuActive(this.type);
                    this.authService.setProfileURL();
                    this.utilsService.showToast(SUCCESS, res.message[0]);
                }
            },
            (err) => {
                this.loaderService.stopLoader();
                this.utilsService.showToast(WARNING, err.message);
            }
        );
    }
}
