import { Component, OnInit } from '@angular/core';
import { NbMenuItem, NbSidebarService } from '@nebular/theme';
import { delay } from 'rxjs/operators';
import { SidebarService } from 'src/app/@core/services';

@Component({
    selector: 'app-side-nav',
    templateUrl: './side-nav.component.html'
})
export class SideNavComponent implements OnInit {
    sideNavMenus: Array<NbMenuItem> = [];
    constructor(private readonly nbSidebarService: NbSidebarService, private readonly sidebarService: SidebarService) {
        this.initSideNav();
    }

    ngOnInit(): void {}

    initSideNav(): void {
        this.sidebarService.sidebarMenus$.pipe(delay(0)).subscribe(
            (menuItems) => {
                this.sideNavMenus = [...menuItems['admin'], ...menuItems['project']];
                if (this.sideNavMenus.length) {
                    this.nbSidebarService.expand();
                } else {
                    this.nbSidebarService.collapse();
                }
            },
            (err) => {
                console.log(err);
            }
        );
    }
}
