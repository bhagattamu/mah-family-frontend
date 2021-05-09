import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { SUCCESS, WARNING } from 'src/app/@core/constants/toast.constant';
import { SubjectService } from 'src/app/@core/services/subject.service';
import { UtilsService } from 'src/app/@core/services/utils.service';
import { GENDER } from 'src/app/@core/constants/gender.constant';
import { LoaderService } from 'src/app/@core/services';

@Component({
    selector: 'app-add-new-subject',
    templateUrl: './add-new-subject.component.html',
    styleUrls: ['../subject.component.scss']
})
export class AddNewSubjectComponent implements OnInit {
    newSubjectForm: FormGroup;
    projectId: string;
    genders: Array<any>;
    imageURL: any;
    message: string;
    submitted: boolean;
    // fruits = ['Nepal', 'India', 'Bangladesh'];
    // showList: boolean = true;

    constructor(private fb: FormBuilder, private ref: NbDialogRef<AddNewSubjectComponent>, private subjectService: SubjectService, private utilsService: UtilsService, public loaderService: LoaderService) {
        this.genders = GENDER;
    }

    ngOnInit(): void {
        this.buildNewSubjectForm();
    }

    buildNewSubjectForm(): void {
        this.newSubjectForm = this.fb.group({
            projectId: [this.projectId, [Validators.required]],
            firstName: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            gender: ['', [Validators.required]],
            // familyName: [
            //     this.fb.group({
            //         main: ['', [Validators.required]],
            //         sub: ['', [Validators.required]]
            //     })
            // ],
            country: [''],
            address: [''],
            dateOfBirth: [''],
            dateOfDeath: [''],
            userPicture: ['']
        });
    }

    get SubjectForm(): any {
        return this.newSubjectForm.controls;
    }

    onNewImage(event): void {
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            this.newSubjectForm.patchValue({
                userPicture: file
            });
            const reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = (e) => {
                this.imageURL = e.target.result;
            };
        }
    }

    // onSelectList(country: any) {
    //     console.log(country);
    //     this.newSubjectForm.patchValue({
    //         country: country
    //     });
    //     this.showList = false;
    // }

    onSaveNewSubject({ valid, value }): void {
        if (!valid || !this.projectId) {
            this.submitted = true;
            return;
        }
        this.loaderService.startLoader();
        let formData: any;
        let hasFormData: boolean;
        if (this.SubjectForm.userPicture.value) {
            hasFormData = true;
            formData = new FormData();
            for (const property of Object.keys(this.SubjectForm)) {
                if (property === 'projectId') {
                    formData.append(property, this.projectId);
                } else {
                    formData.append(property, this.SubjectForm[property].value);
                }
            }
        } else {
            hasFormData = false;
            formData = { ...value };
        }
        this.subjectService.createSubject(formData, hasFormData).subscribe(
            (res) => {
                this.submitted = false;
                this.loaderService.stopLoader();
                if (res && res.success) {
                    this.ref.close(res);
                    this.utilsService.showToast(SUCCESS, 'Successfully created subject.');
                } else {
                    this.utilsService.showToast(WARNING, 'Failed to create subject.');
                }
            },
            (err) => {
                this.loaderService.stopLoader();
                this.submitted = false;
                this.utilsService.showToast(WARNING, 'Failed to create subject.');
            }
        );
    }

    closeDialog(): void {
        this.ref.close();
    }
}
