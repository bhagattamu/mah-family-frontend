import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { ProjectService } from 'src/app/@core/services';
import { AuthService } from 'src/app/@core/services/auth.service';
import { ProjectFormComponent } from '../project-form/project-form.component';

@Component({
    selector: 'app-project-dashboard',
    templateUrl: './project-dashboard.component.html',
    styleUrls: ['./project-dashboard.component.scss']
})
export class ProjectDashboardComponent implements OnInit {
    projects: Array<any> = [];
    projectId: string;
    dataFound: boolean;

    constructor(private readonly router: Router, private readonly projectService: ProjectService, private readonly authService: AuthService, private dialogService: NbDialogService) {}

    ngOnInit(): void {
        this.populateProjects();
    }

    populateProjects(): void {
        this.projectService.getAllProjectsInvolved().subscribe((res) => {
            if (res && res.success && res.data.length) {
                this.dataFound = true;
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
            } else {
                this.dataFound = false;
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

    navigateToAddProject(): void {
        this.router.navigate(['/project/add']);
    }

    openNewForm(): void {
        const addProjectDialog = this.dialogService.open(ProjectFormComponent, { context: { type: 'new' } });
        addProjectDialog.onClose.subscribe((res) => {
            if (res) {
                this.projects.push(res);
            }
        });
    }

    updateProject(updatedProject: any): void {
        this.projects.map((project) => {
            if (project._id === updatedProject._id) {
                return updatedProject;
            }
            return project;
        });
    }
}
