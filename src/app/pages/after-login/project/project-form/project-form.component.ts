import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { MessageKey } from 'src/app/@core/constants/messages';
import { SUCCESS, WARNING } from 'src/app/@core/constants/toast.constant';
import { LoaderService, ProjectService, UtilsService } from 'src/app/@core/services';

@Component({
    selector: 'app-project-form',
    templateUrl: './project-form.component.html'
})
export class ProjectFormComponent implements OnInit {
    projectForm: FormGroup;
    type: string;
    project: any;
    submitted: boolean;
    constructor(private ref: NbDialogRef<ProjectFormComponent>, private fb: FormBuilder, private utilsService: UtilsService, public loaderService: LoaderService, private projectService: ProjectService) {}

    ngOnInit(): void {
        this.buildProjectForm();
    }

    buildProjectForm(): void {
        this.projectForm = this.fb.group({
            projectName: ['', [Validators.required]]
        });
        if (this.project && this.type.toUpperCase() === 'EDIT') {
            this.patchForm(this.project);
        }
    }

    get ProjectFromGroup() {
        return this.projectForm.controls;
    }

    patchForm(project: any): void {
        this.projectForm.patchValue({
            projectName: project.projectName
        });
    }

    createNewProject(createProjectDto: any): void {
        this.projectService.createProject(createProjectDto).subscribe(
            (res) => {
                this.loaderService.stopLoader();
                if (res && res.success) {
                    this.ref.close(res.data);
                    this.utilsService.showToast(SUCCESS, res.message);
                } else {
                    this.utilsService.showToast(WARNING, MessageKey.PROJECT_CREATION_FAILED);
                }
            },
            (err) => {
                this.loaderService.stopLoader();
                this.utilsService.showToast(WARNING, err.message);
            }
        );
    }

    updateProject(updateProjectDto: any): void {
        this.projectService.editProject(this.project._id, updateProjectDto).subscribe(
            (res) => {
                this.loaderService.stopLoader();
                if (res && res.success) {
                    this.ref.close(updateProjectDto);

                    this.utilsService.showToast(SUCCESS, res.message);
                } else {
                    this.utilsService.showToast(WARNING, MessageKey.PROJECT_UPDATE_FAILED);
                }
            },
            (err) => {
                this.loaderService.stopLoader();
                this.utilsService.showToast(WARNING, err.message);
            }
        );
    }

    onSubmit({ valid, value }): void {
        if (!valid) {
            this.submitted = true;
            return;
        }
        this.loaderService.startLoader();
        if (this.type.toUpperCase() === 'NEW') {
            this.createNewProject(value);
        } else if (this.type.toUpperCase() === 'EDIT') {
            this.updateProject(value);
        }
    }

    closeDialog(): void {
        this.ref.close();
    }
}
