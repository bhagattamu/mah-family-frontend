import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService, NbMenuItem, NbMenuService } from '@nebular/theme';
import { Subject } from 'rxjs';
import { takeUntil, map, filter } from 'rxjs/operators';
import { ProjectFormComponent } from '../project-form/project-form.component';

@Component({
    selector: 'app-project-card',
    templateUrl: './project-card.component.html',
    styles: [
        `
            .details {
                padding: 1rem;
                border-left: 1px solid transparent;
            }

            .title {
                margin: 0;
                cursor: pointer;
            }

            .details:hover {
                opacity: 0.8;
            }

            nb-card {
                height: calc(100% - 15px);
            }
            .setting-button {
                text-align: end;
            }
        `
    ]
})
export class ProjectCardComponent implements OnInit, OnDestroy {
    @Input() project: any;
    @Output() onUpdate = new EventEmitter();
    menus: Array<NbMenuItem> = [];
    private destroy$: Subject<void> = new Subject<void>();

    constructor(private router: Router, private menuService: NbMenuService, private dialogService: NbDialogService) {}

    ngOnInit(): void {
        this.initMenu();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    initMenu(): void {
        this.menus = [{ title: 'View' }, { title: 'Edit' }, { title: 'Disable' }];
        this.menuService
            .onItemClick()
            .pipe(
                filter(({ tag }) => tag === this.project._id),
                map(({ item }) => item.title),
                takeUntil(this.destroy$)
            )
            .subscribe((title) => {
                switch (title) {
                    case 'View':
                        break;
                    case 'Edit':
                        const editProjectDialog = this.dialogService.open(ProjectFormComponent, { context: { type: 'edit', project: this.project } });
                        editProjectDialog.onClose.subscribe((res) => {
                            if (res) {
                                this.project = { ...this.project, ...res };
                                this.onUpdate.emit(this.project);
                            }
                        });
                        break;
                    case 'Disable':
                        break;
                    default:
                        break;
                }
            });
    }

    onClickedProject(projectId: string): void {
        this.router.navigate([`/project/${projectId}`]);
    }

    onBookmark(): void {
        console.log('Bookmark');
    }
}
