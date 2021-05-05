import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from 'src/app/@core/services';
import { AuthService } from 'src/app/@core/services/auth.service';

@Component({
    selector: 'app-select-project',
    templateUrl: './select-project.component.html'
})
export class SelectProjectComponent implements OnInit {
    projects: Array<any>;
    projectId: string;

    constructor(private readonly router: Router, private readonly projectService: ProjectService, private readonly authService: AuthService) {}

    ngOnInit(): void {
        this.populateProjects();
    }

    populateProjects(): void {
        this.projectService.getAllProjectsInvolved().subscribe((res) => {
            if (res && res.success) {
                this.projects = res.data;
                const runningProject = this.projectService.getCurrentRunningProject();
                const currentUser = this.authService.getUserData();
                if (runningProject && runningProject.projectId && currentUser && runningProject.userId === currentUser.id) {
                    this.projectId = runningProject.projectId;
                } else {
                    this.projectId = this.projects.find((project) => project.pinned)._id;
                }
                if (!this.projectId) {
                    this.projectId = this.projects[0]._id;
                }
            }
        });
    }

    onProjectChange(event: any): void {
        this.projectId = event;
    }

    navigateToProperDestination(): void {
        this.projectService.setCurrentRunningProject(this.projectId);
        this.router.navigate([`${this.router.url}/${this.projectId}`]);
    }
}
