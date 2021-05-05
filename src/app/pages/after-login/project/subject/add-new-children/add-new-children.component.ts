import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { GENDER } from 'src/app/@core/constants/gender.constant';
import { SUCCESS, WARNING } from 'src/app/@core/constants/toast.constant';
import { SubjectService } from 'src/app/@core/services/subject.service';
import { UtilsService } from 'src/app/@core/services/utils.service';

@Component({
    selector: 'app-add-new-children',
    templateUrl: './add-new-children.component.html',
    styleUrls: ['../subject.component.scss']
})
export class AddNewChildrenComponent implements OnInit {
    subject: any;
    projectId: string;
    newChildForm: FormGroup;
    genders: Array<any>;
    parents: Array<any>;
    imageURL: any;

    constructor(private readonly ref: NbDialogRef<AddNewChildrenComponent>, private readonly fb: FormBuilder, private readonly subjectService: SubjectService, private readonly utilsService: UtilsService) {
        this.genders = GENDER;
    }

    ngOnInit(): void {
        this.populateParents();
        this.buildChildForm();
    }

    buildChildForm(): void {
        this.newChildForm = this.fb.group({
            projectId: [''],
            parent: [''],
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

    get ChildForm(): any {
        return this.newChildForm.controls;
    }

    populateParents(): void {
        this.subjectService.getSubjectById(this.subject?._id).subscribe((res) => {
            if (res && res.success) {
                this.parents = res.data.marriages;
            }
        });
    }

    onNewImage(event): void {
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            this.newChildForm.patchValue({
                userPicture: file
            });
            const reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = (e) => {
                this.imageURL = e.target.result;
            };
        }
    }

    onSaveNewChild({ value, valid }): void {
        if (!valid) {
            return;
        }
        value.projectId = this.projectId;
        let formData: any;
        let hasFormData: boolean;
        if (this.ChildForm.userPicture.value) {
            hasFormData = true;
            formData = new FormData();
            for (const property of Object.keys(this.ChildForm)) {
                if (property === 'projectId') {
                    formData.append(property, this.projectId);
                } else {
                    formData.append(property, this.ChildForm[property].value);
                }
            }
        } else {
            hasFormData = false;
            formData = { ...value };
        }

        this.subjectService.createChild(formData, hasFormData, this.subject?._id).subscribe(
            (res) => {
                if (res && res.success) {
                    this.ref.close(res);
                    this.utilsService.showToast(SUCCESS, 'Successfully created child.');
                } else {
                    this.utilsService.showToast(WARNING, 'Failed to create child.');
                }
            },
            (err) => {
                this.utilsService.showToast(WARNING, 'Failed to create child.');
            }
        );
    }

    closeDialog(): void {
        this.ref.close();
    }
}
