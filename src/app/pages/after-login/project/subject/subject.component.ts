import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbMenuItem, NbMenuService, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { Subscription } from 'rxjs';
import { WARNING } from 'src/app/@core/constants/toast.constant';
import { LoaderService, UtilsService } from 'src/app/@core/services';
import { ProjectService } from 'src/app/@core/services/project.service';
import { SubjectService } from 'src/app/@core/services/subject.service';
import { environment } from 'src/environments/environment';
import { AddNewChildrenComponent } from './add-new-children/add-new-children.component';
import { AddNewSpouseComponent } from './add-new-spouse/add-new-spouse.component';
import { AddNewSubjectComponent } from './add-new-subject/add-new-subject.component';

interface TreeNode<T> {
    data: T;
    children?: TreeNode<T>[];
    expanded?: boolean;
}

interface FSEntry {
    firstName: string;
    lastName: string;
    spouse: string;
    country: Date;
    address: Date;
    detail: any;
}
@Component({
    selector: 'app-subject',
    templateUrl: './subject.component.html',
    styleUrls: ['./subject.component.scss']
})
export class SubjectComponent implements OnInit, OnDestroy {
    projects: Array<any>;
    projectId: string;
    subjects: Array<any>;
    tableData: Array<any> = [];
    columns = ['firstName', 'lastName', 'spouse', 'address', 'action'];
    columnNames = ['First Name', 'Last Name', 'Spouse', 'Address', 'Action'];
    data: NbTreeGridDataSource<FSEntry>;
    menuItems: NbMenuItem[];
    rowData: any;
    menuClickSubscribe: Subscription;
    BASE_URL = environment.API_HOST + '/files/subject-picture/';
    componentType: string;
    dataFound: boolean;

    constructor(
        private readonly projectService: ProjectService,
        private readonly router: Router,
        private readonly dialogService: NbDialogService,
        private readonly subjectService: SubjectService,
        public dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>,
        private readonly menuService: NbMenuService,
        private readonly activatedRoute: ActivatedRoute,
        public loaderService: LoaderService,
        private utilsService: UtilsService
    ) {
        this.projectId = this.activatedRoute.snapshot.params.projectId;
        if (this.router.url.includes('/family-tree')) {
            this.componentType = 'family-tree';
        } else {
            this.componentType = 'subject';
        }
    }

    ngOnInit(): void {
        this.populateProjects();
        this.initMenu();
    }

    ngOnDestroy(): void {
        if (this.menuClickSubscribe) {
            this.menuClickSubscribe.unsubscribe();
        }
    }

    initMenu() {
        this.menuItems = [{ title: 'Add Spouse' }, { title: 'Add Child' }, { title: 'View Tree' }, { title: 'Disable' }];
        this.menuClickSubscribe = this.menuService.onItemClick().subscribe((event) => {
            const { item } = event;
            switch (item.title) {
                case 'Add Spouse':
                    const addSpouseDialogOpen = this.dialogService.open(AddNewSpouseComponent, { context: { subject: this.rowData?.detail, projectId: this.projectId } });
                    addSpouseDialogOpen.onClose.subscribe((onCloseRes) => {
                        if (onCloseRes && onCloseRes.success) {
                            this.tableData = [...this.tableData, onCloseRes.data.spouse];
                            this.tableData = this.tableData.map((tr) => {
                                if (tr._id === onCloseRes.data.mainSubject._id) {
                                    return onCloseRes.data.mainSubject;
                                }
                                return tr;
                            });
                            const tableData = [...this.tableData];
                            this.data = this.dataSourceBuilder.create(this.createTreeGridDataArray(tableData));
                        }
                    });
                    break;
                case 'Add Child':
                    const addChildDialogOpen = this.dialogService.open(AddNewChildrenComponent, { context: { subject: this.rowData?.detail, projectId: this.projectId } });
                    addChildDialogOpen.onClose.subscribe((onCloseRes) => {
                        if (onCloseRes && onCloseRes.success) {
                            this.tableData = [...this.tableData, onCloseRes.data.child];
                            this.tableData = this.tableData.map((tr) => {
                                if (tr._id === onCloseRes.data.mainParent._id) {
                                    return onCloseRes.data.mainParent;
                                }
                                if (tr._id === onCloseRes.data.anotherParent._id) {
                                    return onCloseRes.data.anotherParent;
                                }
                                return tr;
                            });
                            const tableData = [...this.tableData];
                            this.data = this.dataSourceBuilder.create(this.createTreeGridDataArray(tableData));
                        }
                    });
                    break;
                case 'View Tree':
                    this.router.navigate([`/project/family-tree/${this.projectId}/${this.rowData.detail._id}`]);
                    break;
                default:
                    break;
            }
        });
    }

    populateProjects(): void {
        this.loaderService.startLoader();
        this.dataFound = false;
        this.projectService.getAllProjectsInvolved().subscribe(
            (res) => {
                if (res && res.success) {
                    this.projects = res.data;
                    if (!this.projectId) {
                        this.projectId = this.projects[0]._id;
                    }
                    this.subjectService.getSubjectByProjectId(this.projectId).subscribe(
                        (res) => {
                            this.loaderService.stopLoader();
                            if (res && res.success && res.data && res.data.length) {
                                this.dataFound = true;
                                this.tableData = res.data;
                                this.subjects = [...res.data];
                                this.data = this.dataSourceBuilder.create(this.createTreeGridDataArray(this.subjects));
                            } else {
                                if (this.componentType === 'family-tree') {
                                    const addSubjectDialogOpen = this.dialogService.open(AddNewSubjectComponent, { context: { projectId: this.projectId, message: 'SUBJECT_MODULE.MESSAGE.ADD_ROOT_SUBJECT' } });
                                    addSubjectDialogOpen.onClose.subscribe((onCloseRes) => {
                                        if (onCloseRes && onCloseRes.success) {
                                            this.tableData = [...this.tableData, onCloseRes.data];
                                            const tableData = [...this.tableData];
                                            this.data = this.dataSourceBuilder.create(this.createTreeGridDataArray(tableData));
                                        } else {
                                            this.router.navigate(['/project/' + this.projectId]);
                                        }
                                    });
                                } else {
                                    this.loaderService.stopLoader();
                                }
                            }
                        },
                        (err) => {
                            this.loaderService.stopLoader();
                            this.utilsService.showToast(WARNING, err.message);
                        }
                    );
                }
            },
            (err) => {
                this.loaderService.stopLoader();
                this.utilsService.showToast(WARNING, err.message);
            }
        );
    }

    createSpouse(subject: any): string {
        if (subject?.marriages?.length) {
            let spouseName = '';
            subject?.marriages?.map((marriage, i) => {
                spouseName = spouseName + `${i ? ', ' : ''}${marriage?.spouse?.firstName} ${marriage?.spouse?.lastName}`;
            });
            return spouseName;
        } else {
            return '-';
        }
    }

    createTreeGridDataArray(subjects: Array<any>) {
        let treeDataArray = [];
        this.subjects = subjects;
        this.subjects.map((subject) => {
            if (subject) {
                const rowData = this.populateChildrens(subject);
                treeDataArray.push(rowData);
                return rowData;
            }
        });
        return treeDataArray;
    }

    populateChildrens(subject) {
        let rowData = this.createTreeGridData(subject);
        if (subject?.marriages && subject?.marriages?.length) {
            subject?.marriages?.forEach((marriage: any) => {
                const spouseIndex = this.subjects.findIndex((subject) => subject._id === marriage.spouse._id);
                if (spouseIndex > -1) {
                    this.subjects.splice(spouseIndex, 1);
                }
                if (marriage?.childrens && marriage?.childrens?.length) {
                    marriage?.childrens?.map((child) => {
                        let childIndex;
                        const childObj = this.subjects.find((subject, i) => {
                            childIndex = subject._id === child.children ? i : childIndex;
                            return subject._id === child.children;
                        });
                        if (childObj) {
                            if (rowData.children) {
                                rowData.children.push(this.populateChildrens(childObj));
                            } else {
                                rowData.children = [this.populateChildrens(childObj)];
                            }
                            if (childIndex > -1) {
                                this.subjects.splice(childIndex, 1);
                            }
                        }
                    });
                }
            });
        }
        return rowData;
    }

    createTreeGridData(subject: any): TreeNode<FSEntry> {
        const spouse = this.createSpouse(subject);
        return {
            data: {
                firstName: subject.firstName,
                lastName: subject.lastName,
                spouse: spouse,
                country: subject.country,
                address: subject.address,
                detail: subject
            }
        };
    }

    openAddSubjectDialog(): void {
        const addSubjectDialogOpen = this.dialogService.open(AddNewSubjectComponent, { context: { projectId: this.projectId } });
        addSubjectDialogOpen.onClose.subscribe((onCloseRes) => {
            if (onCloseRes && onCloseRes.success) {
                this.tableData = [...this.tableData, onCloseRes.data];
                const tableData = [...this.tableData];
                this.data = this.dataSourceBuilder.create(this.createTreeGridDataArray(tableData));
            }
        });
    }

    onProjectChange(event: any): void {
        this.projectId = event;
        this.subjectService.getSubjectByProjectId(event).subscribe((res) => {
            if (res && res.success) {
                this.tableData = res.data;
                this.subjects = [...res.data];
                this.data = this.dataSourceBuilder.create(this.createTreeGridDataArray(this.subjects));
            }
        });
    }

    openMenu(rowData: any) {
        this.rowData = rowData;
    }
}
