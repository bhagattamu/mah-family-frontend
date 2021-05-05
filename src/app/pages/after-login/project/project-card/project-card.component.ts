import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbMenuItem } from '@nebular/theme';

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
export class ProjectCardComponent implements OnInit {
    @Input() project: any;
    menus: Array<NbMenuItem> = [{ title: 'View' }, { title: 'Disable' }];

    constructor(private router: Router) {}

    ngOnInit(): void {}

    onClickedProject(projectId: string): void {
        this.router.navigate([`/project/${projectId}`]);
    }

    onBookmark(): void {
        console.log('Bookmark');
    }
}
