import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService, NbMenuItem, NbMenuService, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { Subscription } from 'rxjs';
import { ProjectService } from 'src/app/@core/services/project.service';
import { AddNewProjectComponent } from './add-new-project/add-new-project.component';

interface TreeNode<T> {
    data: T;
    children?: TreeNode<T>[];
    expanded?: boolean;
}

interface FSEntry {
    projectName: string;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    id: string;
}
@Component({
    selector: 'app-project',
    templateUrl: './project.component.html',
    styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit, OnDestroy {
    columns = ['projectName', 'createdBy', 'createdAt', 'updatedAt', 'action'];
    columnNames = ['Project Name', 'Created By', 'Created At', 'Updated At', 'Action'];
    menuItems: NbMenuItem[];
    data: any;
    rowData: FSEntry;
    tableData: Array<TreeNode<FSEntry>>;
    menuClickSubscribe: Subscription;
    formType: string = 'new';
    formData: FSEntry;

    constructor(private menuService: NbMenuService, private dialogService: NbDialogService, private router: Router, private readonly projectService: ProjectService, public dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>) {
        this.menuItems = [{ title: 'Manage' }, { title: 'Disable' }];
    }

    ngOnInit(): void {
        this.fetchAllProjects();
        this.menuClickSubscribe = this.menuService.onItemClick().subscribe((event) => {
            const { item } = event;
            switch (item.title) {
                case 'Manage':
                    this.router.navigate([`/project/${this.rowData.id}`]);
                    break;
                default:
                    break;
            }
        });
    }

    ngOnDestroy(): void {
        this.menuClickSubscribe.unsubscribe();
    }

    createTreeGridDataArray(projects: Array<any>) {
        return projects.map((project) => {
            const rowData: TreeNode<FSEntry> = {
                data: {
                    projectName: project.projectName,
                    createdBy: project.createdBy,
                    createdAt: project.createdAt,
                    updatedAt: project.updatedAt,
                    id: project._id
                }
            };
            return rowData;
        });
    }

    createTreeGridData(project: any): TreeNode<FSEntry> {
        return {
            data: {
                projectName: project.projectName,
                createdBy: project.createdBy,
                createdAt: project.createdAt,
                updatedAt: project.updatedAt,
                id: project._id
            }
        };
    }

    fetchAllProjects(): void {
        this.projectService.getAllProjectsInvolved().subscribe(
            (res) => {
                if (res && res.success) {
                    this.tableData = this.createTreeGridDataArray(res.data);
                    this.data = this.dataSourceBuilder.create(this.tableData);
                }
            },
            (err) => {
                console.log(err);
            }
        );
    }

    openAddProjectComponent(): void {
        const addProjectDialogComponent = this.dialogService.open(AddNewProjectComponent, { context: {} });
        addProjectDialogComponent.onClose.subscribe((closeRes) => {
            if (closeRes) {
                this.tableData = [...this.tableData, this.createTreeGridData(closeRes)];
                this.data = this.dataSourceBuilder.create(this.tableData);
            }
        });
    }

    createProject(newProject: any): void {
        this.tableData = [...this.tableData, this.createTreeGridData(newProject)];
        this.data = this.dataSourceBuilder.create(this.tableData);
    }

    updateProject(updatedProject: any): void {
        this.tableData = this.tableData.map((tableRow) => {
            if (tableRow.data.id === this.formData.id) {
                return {
                    ...tableRow,
                    data: {
                        ...tableRow.data,
                        projectName: updatedProject.projectName
                    }
                };
            }
            return tableRow;
        });
        this.data = this.dataSourceBuilder.create(this.tableData);
    }

    openMenu(rowData: FSEntry) {
        this.rowData = rowData;
    }

    clickRow(rowData: FSEntry): void {
        this.formType = 'view';
        this.formData = rowData;
    }
}
