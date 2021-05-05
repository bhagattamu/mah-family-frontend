import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { SubjectTimelineService } from 'src/app/@core/services/subject-timeline.service';
import { PromptYesNoComponent } from 'src/app/pages/shared/common/prompt-yes-no/prompt-yes-no.component';

@Component({
    selector: 'app-timeline',
    templateUrl: './timeline.component.html',
    styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {
    @Input() timelines: any;
    @Input() projectId: string;
    @Input() timelineProjectId: string;
    @Output() deleteTimeline = new EventEmitter();

    constructor(private router: Router, private dialogService: NbDialogService, private timelineService: SubjectTimelineService) {}

    ngOnInit(): void {}

    onClickEdit(timeline: any): void {
        this.router.navigate(['/project/timeline-project/edit-timeline/' + timeline.timelineProject], { queryParams: { projectId: this.projectId, timelinePoint: timeline._id } });
    }

    onClickDelete(timeline: any): void {
        const promptOpen = this.dialogService.open(PromptYesNoComponent, { context: { question: 'Do you want to delete this timeline point?' } });
        promptOpen.onClose.subscribe((shouldDelete) => {
            if (shouldDelete) {
                this.timelineService.deleteTimelinePointById(timeline._id, this.timelineProjectId).subscribe((res) => {
                    if (res && res.success) {
                        this.deleteTimeline.emit(timeline._id);
                    }
                });
            }
        });
    }
}
