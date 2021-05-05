import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NbDialogService, NbMenuItem, NbMenuService } from '@nebular/theme';
import { Subscription } from 'rxjs';
import { TreeDataService } from 'src/app/@core/services';
import { AddNewChildrenComponent } from '../../subject/add-new-children/add-new-children.component';
import { AddNewSpouseComponent } from '../../subject/add-new-spouse/add-new-spouse.component';

@Component({
    selector: 'app-family-tree-context-menu',
    templateUrl: './context-menu.component.html',
    styleUrls: ['./context-menu.component.scss']
})
export class FamilyTreeContextMenuComponent implements OnInit, OnDestroy {
    @Input() x = 0;
    @Input() y = 0;
    @Input() nodeData: any;
    @Output() click = new EventEmitter();
    menuItems: NbMenuItem[];
    menuClickSubscription: Subscription;
    @ViewChild('myTarget') myTarget;
    treeData: any;
    treeDataSubscription: Subscription;

    constructor(private readonly menuService: NbMenuService, private readonly dialogService: NbDialogService, private treeDataService: TreeDataService) {
        this.initMenu();
    }

    ngOnInit(): void {
        this.treeDataSubscription = this.treeDataService.getTreeData().subscribe((data) => (this.treeData = data));
    }

    ngOnDestroy(): void {
        this.treeDataSubscription.unsubscribe();
        if (this.menuClickSubscription) {
            this.menuClickSubscription.unsubscribe();
        }
    }

    initMenu(): void {
        this.menuItems = [{ title: 'Edit' }, { title: 'Delete' }, { title: 'Add Spouse' }, { title: 'Add Child' }];
        this.menuClickSubscription = this.menuService.onItemClick().subscribe((event) => {
            const { item } = event;
            switch (item.title) {
                case 'Add Spouse':
                    const addSpouseDialogOpen = this.dialogService.open(AddNewSpouseComponent, { context: { subject: this.nodeData, projectId: this.nodeData.projectId } });
                    addSpouseDialogOpen.onClose.subscribe((onCloseRes) => {
                        if (onCloseRes && onCloseRes.success) {
                            const newSpouseMarraiges = onCloseRes.data.spouse.marriages.map((marriage) => {
                                return {
                                    childrens: marriage.childrens,
                                    spouse: marriage.spouse._id,
                                    spousePosition: marriage.spousePosition
                                };
                            });
                            onCloseRes.data.spouse.marriages = newSpouseMarraiges;
                            this.treeData = [...this.treeData, onCloseRes.data.spouse];
                            const index = this.treeData.findIndex((subject) => subject._id === this.nodeData._id);
                            this.treeData = [...this.treeData.slice(0, index), { ...this.treeData[index], marriages: [...this.treeData[index].marriages, { spouse: onCloseRes.data.spouse._id, spousePosition: 1, childrens: [] }] }, ...this.treeData.slice(index + 1)];
                            this.treeDataService.setNewTreeData(this.treeData);
                        }
                    });
                    break;
                case 'Add Child':
                    const addChildDialogOpen = this.dialogService.open(AddNewChildrenComponent, { context: { subject: this.nodeData, projectId: this.nodeData.projectId } });
                    addChildDialogOpen.onClose.subscribe((onCloseRes) => {
                        if (onCloseRes && onCloseRes.success) {
                            this.treeData = [...this.treeData, onCloseRes.data.child];
                            let firstParentIndex = this.treeData.findIndex((subject) => subject._id === onCloseRes.data.mainParent._id);
                            let firstMarriageIndex = this.treeData[firstParentIndex].marriages.findIndex((marriage) => marriage.spouse === onCloseRes.data.anotherParent._id);
                            let secondParentIndex = this.treeData.findIndex((subject) => subject._id === onCloseRes.data.anotherParent._id);
                            let secondMarriageIndex = this.treeData[secondParentIndex].marriages.findIndex((marriage) => marriage.spouse === onCloseRes.data.mainParent._id);
                            this.treeData = [
                                ...this.treeData.slice(0, firstParentIndex),
                                {
                                    ...this.treeData[firstParentIndex],
                                    marriages: [
                                        ...this.treeData[firstParentIndex].marriages.slice(0, firstMarriageIndex),
                                        { ...this.treeData[firstParentIndex].marriages[firstMarriageIndex], childrens: [...this.treeData[firstParentIndex].marriages[firstMarriageIndex].childrens, { childPosition: 1, children: onCloseRes.data.child._id }] },
                                        ...this.treeData[firstParentIndex].marriages.slice(firstMarriageIndex + 1)
                                    ]
                                },
                                ...this.treeData.slice(firstParentIndex + 1)
                            ];
                            this.treeData = [
                                ...this.treeData.slice(0, secondParentIndex),
                                {
                                    ...this.treeData[secondParentIndex],
                                    marriages: [
                                        ...this.treeData[secondParentIndex].marriages.slice(0, secondMarriageIndex),
                                        { ...this.treeData[secondParentIndex].marriages[secondMarriageIndex], childrens: [...this.treeData[secondParentIndex].marriages[secondMarriageIndex].childrens, { childPosition: 1, children: onCloseRes.data.child._id }] },
                                        ...this.treeData[secondParentIndex].marriages.slice(secondMarriageIndex + 1)
                                    ]
                                },
                                ...this.treeData.slice(secondParentIndex + 1)
                            ];
                            this.treeDataService.setNewTreeData(this.treeData);
                        }
                    });
                    break;
                default:
                    break;
            }
        });
    }

    @HostListener('document:click', ['$event'])
    onClick(e: any) {
        if (e) {
            const clickedInside = this.myTarget.nativeElement.contains(e?.target);
            if (!clickedInside) {
                this.click.emit();
            }
        }
    }
}
