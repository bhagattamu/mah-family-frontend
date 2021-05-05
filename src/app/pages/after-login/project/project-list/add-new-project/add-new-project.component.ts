import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { SUCCESS, WARNING } from 'src/app/@core/constants/toast.constant';
import { LoaderService } from 'src/app/@core/services';
import { ProjectService } from 'src/app/@core/services/project.service';
import { UtilsService } from 'src/app/@core/services/utils.service';

@Component({
    selector: 'app-add-new-project',
    templateUrl: './add-new-project.component.html'
})
export class AddNewProjectComponent implements OnInit, OnChanges {
    @Input() type: string;
    @Input() project: any;
    @Output() onCreate = new EventEmitter();
    @Output() onUpdate = new EventEmitter();
    submitted: boolean;
    newProjectForm: FormGroup;
    actionButtons: Array<any> = [
        {
            title: 'new',
            active: false
        },
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
        }
    ];

    constructor(private fb: FormBuilder, private readonly projectService: ProjectService, private readonly utilsService: UtilsService, public readonly loaderService: LoaderService) {}

    ngOnInit(): void {
        this.buildNewProjectForm();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['project'].currentValue) {
            this.project = changes['project'].currentValue;
            this.resetForm();
            this.makeMenuActive('view');
        }
    }

    makeMenuActive(type: string): void {
        this.type = type;
        if (this.type === 'view') {
            this.newProjectForm.disable();
            this.actionButtons = this.actionButtons.map((button) => {
                if (button.title === 'new' || button.title === 'edit') {
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
        } else if (this.type === 'new') {
            this.actionButtons = this.actionButtons.map((button) => {
                if (button.title === 'new' || button.title === 'edit') {
                    button.active = false;
                } else {
                    button.active = true;
                }
                return button;
            });
        }
    }

    getButtonActiveStatus(title: string): boolean {
        return this.actionButtons.find((button) => button.title === title).active;
    }

    buildNewProjectForm(): void {
        this.newProjectForm = this.fb.group({
            projectName: [this.project?.projectName, [Validators.required]]
        });
    }

    get ProjectFromGroup() {
        return this.newProjectForm.controls;
    }

    resetForm(): void {
        this.newProjectForm.patchValue({
            projectName: this.project?.projectName
        });
        this.submitted = false;
    }

    editForm(): void {
        this.type = 'edit';
        this.newProjectForm.enable();
        this.makeMenuActive('edit');
    }

    createNewForm(): void {
        this.type = 'new';
        this.makeMenuActive('new');
        this.project = null;
        this.newProjectForm.enable();
        this.newProjectForm.reset();
    }

    createNewProject(createProjectDto: any): void {
        this.projectService.createProject(createProjectDto).subscribe(
            (res) => {
                this.loaderService.stopLoader();
                if (res && res.success) {
                    this.onCreate.emit(res.data);
                    this.createNewForm();
                    this.utilsService.showToast(SUCCESS, 'Successfully created project.');
                } else {
                    this.utilsService.showToast(WARNING, 'Failed to create project.');
                }
            },
            (err) => {
                this.loaderService.stopLoader();
                this.utilsService.showToast(WARNING, 'Failed to create project.');
            }
        );
    }

    updateProject(updateProjectDto: any): void {
        this.projectService.editProject(this.project.id, updateProjectDto).subscribe(
            (res) => {
                this.loaderService.stopLoader();
                if (res && res.success) {
                    this.onUpdate.emit(updateProjectDto);
                    this.newProjectForm.disable();
                    this.type = 'view';
                    this.makeMenuActive('view');
                    this.utilsService.showToast(SUCCESS, 'Successfully updated project.');
                } else {
                    this.utilsService.showToast(WARNING, 'Failed to update project.');
                }
            },
            (err) => {
                this.loaderService.stopLoader();
                this.utilsService.showToast(WARNING, 'Failed to update project.');
            }
        );
    }

    onSubmit({ valid, value }): void {
        if (!valid) {
            this.submitted = true;
            return;
        }
        this.loaderService.startLoader();
        if (this.type === 'new') {
            this.createNewProject(value);
        } else if (this.type === 'edit') {
            this.updateProject(value);
        }
    }
}
