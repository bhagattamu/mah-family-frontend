import { Component, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SUCCESS, WARNING } from 'src/app/@core/constants/toast.constant';
import { LoaderService, UtilsService } from 'src/app/@core/services';
import { SubjectTimelineService } from 'src/app/@core/services/subject-timeline.service';

enum FormType {
    NEW = 'new',
    EDIT = 'edit'
}

@Component({
    selector: 'app-timeline-project-form',
    templateUrl: './timeline-project-form.component.html'
})
export class TimelineProjectFormComponent implements OnInit, OnDestroy, OnChanges {
    @Input() type: string;
    @Input() projectId: string;
    @Input() timelineProject: any;
    @Output() onCreate = new EventEmitter();
    @Output() onUpdate = new EventEmitter();
    @Output() onNew = new EventEmitter();
    timelineProjectFormGroup: FormGroup;
    submitted: boolean;
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

    constructor(private fb: FormBuilder, private timelineService: SubjectTimelineService, private utilsService: UtilsService, public readonly loaderService: LoaderService) {}

    ngOnInit(): void {
        this.buildTimelineProjectForm();
    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log(changes['timelineProject']);
        if (changes['timelineProject'].currentValue) {
            this.timelineProject = changes['timelineProject'].currentValue;
            this.resetForm();
            this.makeMenuActive('view');
        }
    }

    ngOnDestroy(): void {}

    makeMenuActive(type: string): void {
        this.type = type;
        if (this.type === 'view') {
            this.timelineProjectFormGroup.disable();
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

    buildTimelineProjectForm(): void {
        this.timelineProjectFormGroup = this.fb.group({
            project: [this.projectId, [Validators.required]],
            title: [this.timelineProject?.title, [Validators.required]]
        });
    }

    get TimelineProjectFormGroup() {
        return this.timelineProjectFormGroup.controls;
    }

    resetForm(): void {
        this.timelineProjectFormGroup.patchValue({
            project: this.projectId,
            title: this.timelineProject?.title
        });
        this.submitted = false;
    }

    editForm(): void {
        this.type = 'edit';
        this.timelineProjectFormGroup.enable();
        this.makeMenuActive('edit');
    }

    createNewForm(): void {
        this.type = 'new';
        this.makeMenuActive('new');
        this.timelineProject = null;
        this.timelineProjectFormGroup.enable();
        this.resetForm();
        this.onNew.emit();
    }

    createNewTimelineProject(formData: any) {
        this.timelineService.createTimelineProject(formData).subscribe(
            (res) => {
                this.loaderService.stopLoader();
                if (res.success) {
                    this.utilsService.showToast(SUCCESS, res.message[0]);
                    this.onCreate.emit(res.data);
                    this.createNewForm();
                } else {
                    this.utilsService.showToast(WARNING, 'UNKNOWN ERR');
                }
            },
            (err) => {
                this.loaderService.stopLoader();
                this.utilsService.showToast(WARNING, err.message);
            }
        );
    }

    editNewTimelineProject(formData: any): void {
        this.timelineService.updateTimelineProject(this.timelineProject._id, formData).subscribe(
            (res) => {
                this.loaderService.stopLoader();
                if (res && res.success) {
                    this.utilsService.showToast(SUCCESS, res.message[0]);
                    this.onUpdate.emit({ ...this.timelineProject, title: formData.title });
                    this.createNewForm();
                } else {
                    this.utilsService.showToast(WARNING, 'UNKNOWN ERR');
                }
            },
            (err) => {
                this.loaderService.stopLoader();
                this.utilsService.showToast(WARNING, err.message);
            }
        );
    }

    onSubmit({ valid, value }): void {
        console.log(valid, value, this.type);
        if (!valid) {
            this.submitted = true;
            return;
        }
        this.loaderService.startLoader();
        if (this.type === FormType.NEW) {
            this.createNewTimelineProject(value);
        } else if (this.type === FormType.EDIT) {
            this.editNewTimelineProject(value);
        }
    }
}
