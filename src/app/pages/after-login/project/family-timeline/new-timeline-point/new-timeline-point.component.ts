import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from 'src/app/@core/services';

@Component({
    selector: 'app-new-timeline-point',
    template: `
        <div class="page-header">
            <h1 class="title">Create Timeline</h1>
        </div>
        <app-timeline-point-form [timelineProjectId]="timelineProjectId" [projectId]="projectId" [timelinePoint]="timelinePoint"></app-timeline-point-form>
    `
})
export class NewTimelinePointComponent implements OnInit {
    timelineProjectId: string;
    timelinePoint: any;
    projectId: string;

    constructor(private activatedRoute: ActivatedRoute, private readonly projectService: ProjectService) {
        this.timelineProjectId = this.activatedRoute.snapshot.params.timelineProjectId;
        this.projectId = this.activatedRoute.snapshot.queryParams.projectId;
    }
    ngOnInit(): void {
        this.projectService.initSidenav(this.projectId);
    }
}
