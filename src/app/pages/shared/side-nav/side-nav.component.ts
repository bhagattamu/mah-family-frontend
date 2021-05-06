import { Component, OnInit } from '@angular/core';
import { NbMenuItem, NbSidebarService } from '@nebular/theme';
import { SidebarService } from 'src/app/@core/services';

@Component({
    selector: 'app-side-nav',
    templateUrl: './side-nav.component.html'
})
export class SideNavComponent implements OnInit {
    sideNavMenus: Array<NbMenuItem> = [];
    constructor(private readonly nbSidebarService: NbSidebarService, private readonly sidebarService: SidebarService) {}

    ngOnInit(): void {}
}
