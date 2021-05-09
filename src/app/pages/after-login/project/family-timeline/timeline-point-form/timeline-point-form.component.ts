import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SUCCESS } from 'src/app/@core/constants/toast.constant';
import { SubjectService, UtilsService } from 'src/app/@core/services';
import { SubjectTimelineService } from 'src/app/@core/services/subject-timeline.service';

@Component({
    selector: 'app-timeline-point-form',
    templateUrl: './timeline-point-form.component.html'
})
export class TimelinePointFormComponent implements OnInit {
    @Input() timelineProjectId: string;
    @Input() projectId: string;
    @Input() timelinePoint: any;
    formType: string;
    timelineFormGroup: FormGroup;
    subjects: Array<any>;
    submitted: boolean;
    timeline: any;
    events: Array<{
        title: string;
        type: string;
        description: string;
        timestamp: Date;
        emotionType: string;
        images: Array<string>;
    }>;
    maxDate: Date = new Date();

    constructor(private fb: FormBuilder, private subjectService: SubjectService, private subjectTimelineService: SubjectTimelineService, private router: Router, private utilsService: UtilsService) {}

    ngOnInit(): void {
        this.assignFormType();
        this.buildTimelineFormGroup();
        this.populateSubject();
    }

    assignFormType(): void {
        if (!this.timelinePoint) {
            this.formType = 'NEW';
        } else {
            this.formType = 'EDIT';
            this.subjectTimelineService.getTimelineById(this.timelinePoint, this.timelineProjectId).subscribe((res) => {
                if (res && res.success) {
                    this.timeline = res.data;
                    const newEventDatas = res.data.events.map((event) => {
                        return {
                            title: event.title,
                            type: event.type,
                            description: event.description,
                            timestamp: new Date(event.timestamp),
                            emotionType: event.emotionType,
                            images: []
                        };
                    });
                    this.events = newEventDatas;
                    this.timelineFormGroup.patchValue({
                        subject: this.timeline.subject._id,
                        title: this.timeline.title,
                        date: this.timeline.date,
                        eventsGroup: {
                            eventDatas: newEventDatas
                        }
                    });
                }
            });
        }
    }

    buildTimelineFormGroup(): void {
        this.timelineFormGroup = this.fb.group({
            timelineProject: [this.timelineProjectId, [Validators.required]],
            subject: ['', [Validators.required]],
            title: ['', [Validators.required]],
            date: ['', [Validators.required]],
            eventsGroup: this.fb.group({
                eventDatas: this.fb.array([
                    this.fb.group({
                        title: ['', [Validators.required]],
                        type: ['', [Validators.required]],
                        description: ['', [Validators.required]],
                        timestamp: ['', [Validators.required]],
                        emotionType: ['', [Validators.required]],
                        images: this.fb.array([])
                    })
                ])
            })
        });
    }

    get TimelineForm() {
        return this.timelineFormGroup.controls;
    }

    get eventsGroup(): FormGroup {
        return this.timelineFormGroup.get('eventsGroup') as FormGroup;
    }

    set eventsGroup(eventsGroup: FormGroup) {
        this.timelineFormGroup.setControl('eventsGroup', eventsGroup);
    }

    populateSubject(): void {
        this.subjectService.getSubjectByProjectId(this.projectId).subscribe((res) => {
            if (res && res.success) {
                this.subjects = res.data;
            }
        });
    }

    createTimelinePoint(createTimelinePointDto: any): void {
        createTimelinePointDto['eventDatas'] = createTimelinePointDto.eventsGroup.eventDatas;
        this.subjectTimelineService.createTimelinePoint(createTimelinePointDto).subscribe((res) => {
            if (res && res.success) {
                this.router.navigate(['/project/timeline-project/manage-timeline/' + this.timelineProjectId]);
                this.utilsService.showToast(SUCCESS, 'Successfully created a timeline point.');
            }
        });
    }

    updateTimelinePoint(updateTimelinePointDto: any): void {
        updateTimelinePointDto['eventDatas'] = updateTimelinePointDto.eventsGroup.eventDatas;
        this.subjectTimelineService.updateTimelineById(this.timelinePoint, this.timelineProjectId, updateTimelinePointDto).subscribe((res) => {
            if (res && res.success) {
                this.router.navigate(['/project/timeline-project/manage-timeline/' + this.timelineProjectId]);
                this.utilsService.showToast(SUCCESS, 'Successfully updated a timeline point.');
            }
        });
    }

    onSubmit({ valid, value }): void {
        if (!valid) {
            this.submitted = true;
            return;
        }
        if (this.formType === 'NEW') {
            this.createTimelinePoint(value);
        } else if (this.formType === 'EDIT') {
            this.updateTimelinePoint(value);
        }
    }
}
