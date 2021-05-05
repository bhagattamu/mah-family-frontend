import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { GENDER } from 'src/app/@core/constants/gender.constant';
import { SUCCESS, WARNING } from 'src/app/@core/constants/toast.constant';
import { SubjectService } from 'src/app/@core/services/subject.service';
import { UtilsService } from 'src/app/@core/services/utils.service';

@Component({
    selector: 'app-add-new-spouse',
    templateUrl: './add-new-spouse.component.html',
    styleUrls: ['../subject.component.scss']
})
export class AddNewSpouseComponent implements OnInit {
    subject: any;
    projectId: string;
    newSpouseForm: FormGroup;
    genders: Array<any>;
    imageURL: any;
    constructor(private readonly ref: NbDialogRef<AddNewSpouseComponent>, private readonly fb: FormBuilder, private subjectService: SubjectService, private utilsService: UtilsService) {
        this.genders = GENDER;
    }

    ngOnInit(): void {
        this.buildNewSpouseForm();
    }

    buildNewSpouseForm(): void {
        this.newSpouseForm = this.fb.group({
            projectId: [''],
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

    get SpouseForm(): any {
        return this.newSpouseForm.controls;
    }

    onNewImage(event): void {
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            this.newSpouseForm.patchValue({
                userPicture: file
            });
            const reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = (e) => {
                this.imageURL = e.target.result;
            };
        }
    }

    onSaveNewSpouse({ value, valid }): void {
        if (!valid) {
            return;
        }
        value.projectId = this.projectId;
        let formData: any;
        let hasFormData: boolean;
        if (this.SpouseForm.userPicture.value) {
            hasFormData = true;
            formData = new FormData();
            for (const property of Object.keys(this.SpouseForm)) {
                if (property === 'projectId') {
                    formData.append(property, this.projectId);
                } else {
                    formData.append(property, this.SpouseForm[property].value);
                }
            }
        } else {
            hasFormData = false;
            formData = { ...value };
        }
        this.subjectService.createSpouse(formData, hasFormData, this.subject?._id).subscribe(
            (res) => {
                if (res && res.success) {
                    this.ref.close(res);
                    this.utilsService.showToast(SUCCESS, 'Successfully created spouse.');
                } else {
                    this.utilsService.showToast(WARNING, 'Failed to create spouse.');
                }
            },
            (err) => {
                this.utilsService.showToast(WARNING, 'Failed to create subject.');
            }
        );
    }

    closeDialog(): void {
        this.ref.close();
    }
}
