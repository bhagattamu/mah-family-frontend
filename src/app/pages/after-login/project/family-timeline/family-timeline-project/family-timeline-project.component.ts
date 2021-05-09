import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbMenuItem, NbMenuService, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { Subscription } from 'rxjs';
import { ProjectService } from 'src/app/@core/services';
import { SubjectTimelineService } from 'src/app/@core/services/subject-timeline.service';

interface TreeNode<T> {
    data: T;
    children?: TreeNode<T>[];
    expanded?: boolean;
}

interface FSEntry {
    title: string;
    createdBy: string;
    timelineProject: any;
}
@Component({
    selector: 'app-family-timeline-project',
    templateUrl: './family-timeline-project.component.html'
})
export class FamilyTimelineProjectComponent implements OnInit, OnDestroy {
    projectId: string;
    columns = ['title', 'createdBy', 'action'];
    columnNames = ['Title', 'Created By', 'Action'];
    data: NbTreeGridDataSource<FSEntry>;
    tableData: Array<TreeNode<FSEntry>>;
    menuItems: NbMenuItem[];
    timelineProject: any;
    menuClickSubscribe: Subscription;
    formType: string = 'new';
    formData: FSEntry;

    constructor(private readonly activatedRoute: ActivatedRoute, private timelineService: SubjectTimelineService, public dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>, private menuService: NbMenuService, private router: Router, private readonly projectService: ProjectService) {
        this.projectId = this.activatedRoute.snapshot.params.projectId;
        if (!this.projectId) {
            console.log('Invalid route');
        }
    }

    ngOnInit(): void {
        this.projectService.initSidenav(this.projectId);
        this.initializeMenu();
        this.getAllTimelineProject();
    }

    ngOnDestroy(): void {
        this.menuClickSubscribe.unsubscribe();
    }

    initializeMenu(): void {
        this.menuItems = [{ title: 'Manage' }, { title: 'Disable' }];
        this.menuClickSubscribe = this.menuService.onItemClick().subscribe((event) => {
            const { item } = event;
            switch (item.title) {
                case 'Manage':
                    this.router.navigate([`/project/timeline-project/manage-timeline/${this.timelineProject._id}`]);
                    break;
                default:
                    break;
            }
        });
    }

    createTreeGridDataArray(timelineProjects: Array<any>) {
        return timelineProjects.map((timelineProject) => {
            const rowData: TreeNode<FSEntry> = {
                data: {
                    title: timelineProject.title,
                    createdBy: timelineProject.createdBy.fullName,
                    timelineProject: timelineProject
                }
            };
            return rowData;
        });
    }

    getAllTimelineProject(): void {
        this.timelineService.getAllTimelineProject(this.projectId).subscribe((res) => {
            if (res && res.success && res.data.length) {
                this.tableData = this.createTreeGridDataArray(res.data);
                this.data = this.dataSourceBuilder.create(this.tableData);
            }
        });
    }

    updateTimelineProject(updateEvent: any): void {
        console.log(updateEvent);
        this.tableData = this.tableData.map((rowData) => {
            if (updateEvent._id === rowData.data.timelineProject._id) {
                return {
                    data: {
                        title: updateEvent.title,
                        createdBy: updateEvent.createdBy.fullName,
                        timelineProject: updateEvent
                    }
                };
            }
            return rowData;
        });
        this.data = this.dataSourceBuilder.create(this.tableData);
    }

    createTimelineProject(createEvent: any): void {
        if (!this.tableData) {
            this.tableData = [];
        }
        this.tableData.push({
            data: {
                title: createEvent.title,
                createdBy: createEvent.createdBy.fullName,
                timelineProject: createEvent
            }
        });
        this.data = this.dataSourceBuilder.create(this.tableData);
    }

    onNewForm(): void {
        this.formData = null;
    }

    openMenu(timelineProject: any) {
        this.timelineProject = timelineProject;
    }

    clickRow(rowData: FSEntry): void {
        this.formType = 'view';
        this.formData = rowData.timelineProject;
    }
}
