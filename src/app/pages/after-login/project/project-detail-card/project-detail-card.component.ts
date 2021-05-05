import { Component, Input, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/@core/services/project.service';

@Component({
    selector: 'app-project-detail-card',
    templateUrl: './project-detail-card.component.html'
})
export class ProjectDetailCardComponent implements OnInit {
    @Input() projectId: string;
    project: any;

    constructor(private projectService: ProjectService) {}

    ngOnInit(): void {
        this.setProjectDetail();
    }

    setProjectDetail(): void {
        this.projectService.getProjectById(this.projectId).subscribe((res) => {
            if (res && res.success) {
                this.project = {
                    ...res.data,
                    id: res.data._id
                };
            }
        });
    }
}
