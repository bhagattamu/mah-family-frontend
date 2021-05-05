import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbMediaBreakpointsService, NbThemeService } from '@nebular/theme';
import * as dTree from 'd3-dtree';
import { Observable, Subject, Subscription } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { ProjectService, TreeDataService } from 'src/app/@core/services';
import { SubjectService } from 'src/app/@core/services/subject.service';
import { environment } from 'src/environments/environment';
import { FamilyTreeService } from './family-tree.service';

@Component({
    selector: 'app-family-tree',
    templateUrl: './family-tree.component.html',
    styleUrls: ['./family-tree.component.scss']
})
export class FamilyTreeComponent implements OnInit, OnDestroy {
    contextmenu = false;
    contextmenuX = 0;
    contextmenuY = 0;
    rootId: string;
    BASE_URL = environment.API_HOST + '/files/subject-picture/';
    nodeData: any;
    rootData: any;
    treeData: any;
    treeDataSubscription: Subscription;
    projectId: string;
    private destroy$: Subject<void> = new Subject<void>();
    graphHeight: number = 500;
    graphWidth: number = 1200;
    zoomToFit: number = 1000;

    constructor(private readonly activatedRoute: ActivatedRoute, private readonly subjectService: SubjectService, private readonly familyTreeService: FamilyTreeService, private treeDataService: TreeDataService, private readonly projectService: ProjectService, private breakpointService: NbMediaBreakpointsService, private themeService: NbThemeService) {
        this.rootId = this.activatedRoute.snapshot.params.rootId;
        this.projectId = this.activatedRoute.snapshot.parent.params.projectId;
    }

    ngOnInit(): void {
        this.checkBreakPoint();
        this.projectService.initSidenav(this.projectId);
        this.getTreeData();
        this.treeDataSubscription = this.treeDataService.getTreeData().subscribe((data) => {
            if (data && data?.length) {
                let tree = [];
                const constructedTreeData = this.familyTreeService.constructTreeData(data, this.rootId);
                tree.push(constructedTreeData);
                this.createFamilyTree(tree);
            }
        });
    }

    ngOnDestroy(): void {
        this.treeDataSubscription.unsubscribe();
    }

    checkBreakPoint(): void {
        const { xl } = this.breakpointService.getBreakpointsMap();
        this.themeService
            .onMediaQueryChange()
            .pipe(
                map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
                takeUntil(this.destroy$)
            )
            .subscribe((isLessThanXl: boolean) => {
                if (isLessThanXl) {
                    this.graphHeight = 750;
                    this.graphWidth = 600;
                    this.zoomToFit = 1000;
                }
            });
    }

    getTreeData(): void {
        this.subjectService.getTreeDataFromRoot(this.rootId).subscribe((res) => {
            if (res && res.success) {
                this.rootData = res.data.find((subject) => subject._id === this.rootId);
                this.treeDataService.setNewTreeData(res.data);
            }
        });
    }

    createFamilyTree(data): void {
        const graphBlock = document.getElementById(`graph`);
        // remove childNode which is added in initial render when data is empty
        if (graphBlock.hasChildNodes()) {
            graphBlock.childNodes.forEach((childNode) => graphBlock.removeChild(childNode));
        }
        const nodeClicked = (extra) => this.onNodeClick(extra);
        const nodeRightClicked = (extra, mouseObj) => this.onNodeRightClick(extra, mouseObj);
        const coreTree = dTree.init(data, {
            target: `#graph`,
            depthOffset: -1,
            debug: false,
            height: this.graphHeight,
            width: this.graphWidth,
            nodeWidth: 200,
            callbacks: {
                nodeClick: function (name, extra, id) {
                    nodeClicked(extra);
                },
                nodeRightClick: function (name, extra, id) {
                    nodeRightClicked(extra, this);
                },
                textRenderer: (name, extra, textClass, nodeClass) => {
                    // THis callback is optinal but can be used to customize
                    // how the text is rendered without having to rewrite the entire node
                    // from screatch.
                    if (extra && extra?.nickname) {
                        name = name + ' (' + extra?.nickname + ')';
                    }

                    // eslint-disable-next-line no-useless-concat
                    return `<div align='center' class="imageWrap ${nodeClass}">
                            <embed  align='center' src=${extra && extra?.imageURL ? this.BASE_URL + extra?.projectId + '/' + extra?.imageURL : extra?.gender === 'M' ? '/assets/images/subjects/default-male.png' : '/assets/images/subjects/default-female.png'} height="100" width="100" alt="testimage" />
                        </div><br>
                        <div class="imageDetail">
                            <p>${name}</p>
                            <p>${extra && extra?.dateOfBirth ? extra?.dateOfBirth : 'Unknown'} - ${extra && extra?.dateOfDeath ? (extra?.dateOfDeath === '_' ? 'Living' : extra?.dateOfDeath) : 'Unknown'}</p>
                        <div>
                        `;
                },
                nodeRenderer: function (name, x, y, height, width, extra, id, nodeClass, textClass, textRenderer) {
                    // This callback is optional but can be used to customize the
                    // node element using HTML.
                    let node = '';
                    node += '<div ';
                    node += 'style="height:100%; width:100%; display:flex; flex-direction:column; justify-content:center; align-items:center; flex-wrap: wrap; text-align: center; border-radius:20px;" ';
                    node += 'class="node" ';
                    node += 'id="node' + id + '">\n';
                    node += textRenderer(name, extra, textClass, nodeClass);
                    node += '</div>';
                    return node;
                }
            }
        });
        coreTree.zoomToFit(this.zoomToFit);
    }

    onNodeClick(extra: any): void {
        console.log('clicked', extra);
    }

    onNodeRightClick(extra: any, mouseObj: any): void {
        this.nodeData = extra;
        this.contextmenu = true;
        const position = mouseObj.getBoundingClientRect();
        this.contextmenuX = position.left + position.width / 2;
        this.contextmenuY = position.top + position.height / 2;
    }

    onClick(data: any): void {
        this.contextmenu = false;
    }
}
