import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from 'src/app/@core/services';
import { SubjectTimelineService } from 'src/app/@core/services/subject-timeline.service';

@Component({
    selector: 'app-manage-timeline',
    templateUrl: './manage-timeline.component.html'
})
export class ManageTimelineComponent implements OnInit {
    timelineProjectId: string;
    projectId: string;
    timelines: any;

    constructor(private router: Router, private activatedRoute: ActivatedRoute, private timelineService: SubjectTimelineService, private readonly projectService: ProjectService) {
        this.timelineProjectId = this.activatedRoute.snapshot.params.timelineProjectId;
    }

    ngOnInit(): void {
        this.fetchProjectId();
    }

    fetchProjectId(): void {
        this.timelineService.getTimelineProjectById(this.timelineProjectId).subscribe((res) => {
            if (res && res.success) {
                this.projectId = res.data.project;
                this.timelines = res.data.timelines;
                this.projectService.initSidenav(this.projectId);
            }
        });
    }

    addTimelinePoint(): void {
        this.router.navigate(['/project/timeline-project/new-timeline/' + this.timelineProjectId], { queryParams: { projectId: this.projectId } });
    }

    onDeleteTimeline(timelinePointId: string): void {
        this.timelines = this.timelines.filter((timeline: any) => timeline._id !== timelinePointId);
    }
}
