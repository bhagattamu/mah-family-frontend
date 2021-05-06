import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService, NbMenuItem, NbSidebarService } from '@nebular/theme';
import { adminMenus, commonMenus, MENU_KEY, projectMenus } from 'src/app/@core/constants/menu.constant';
import { LangTranslateService, SidebarService } from 'src/app/@core/services';
import { AuthService } from 'src/app/@core/services/auth.service';
import { UserChangePasswordComponent } from './user/change-password/change-password.component';

@Component({
    selector: 'app-after-login',
    template: `
        <ngx-one-column-layout>
            <ng-container *ngIf="!autoPassword">
                <nb-menu [items]="sideNavMenus"></nb-menu>
                <router-outlet></router-outlet>
            </ng-container>
        </ngx-one-column-layout>
    `,
    styleUrls: ['./after-login.component.scss']
})
export class AfterLoginComponent implements OnInit, AfterViewInit {
    autoPassword: boolean;
    sideNavMenus: Array<NbMenuItem>;
    constructor(private readonly authService: AuthService, private readonly dialogService: NbDialogService, private readonly router: Router, private sidebarService: SidebarService, private nbSidebarService: NbSidebarService, private langTranslateService: LangTranslateService) {
        this.autoPassword = this.authService.getUserData().autoPassword;
    }

    ngOnInit(): void {
        this.initSideNavMenu();
    }

    ngAfterViewInit(): void {
        if (this.autoPassword) {
            this.openChangePassword();
        }
    }

    initSideNavMenu(): void {
        this.sideNavMenus = [...adminMenus, ...projectMenus, ...commonMenus];
        this.langTranslateService.getCurrentLangRequest().subscribe((language) => {
            this.langTranslateService.translateMenu(language, this.sideNavMenus);
        });
        if (this.authService.isAdmin()) {
            this.sidebarService.changeMenuStatus(this.sideNavMenus, MENU_KEY.ADMIN, true);
        } else {
            this.sidebarService.changeMenuStatus(this.sideNavMenus, MENU_KEY.ADMIN, false);
        }
        this.sidebarService.menuKeySubject$.subscribe(({ key, status }) => {
            this.sidebarService.changeMenuStatus(this.sideNavMenus, key, status);
        });
        this.sidebarService.projectSubject$.subscribe((projectId) => {
            this.sidebarService.changeMenuStatus(this.sideNavMenus, MENU_KEY.PROJECT_WITHOUT_CHILD, false);
            this.sidebarService.replaceProjectLink(this.sideNavMenus, projectId);
        });
    }

    openChangePassword(): void {
        const changePasswordDialog = this.dialogService.open(UserChangePasswordComponent, { hasBackdrop: true, closeOnBackdropClick: false, closeOnEsc: false });
        changePasswordDialog.onClose.subscribe((res) => {
            if (!res) {
                this.authService.logoutUser();
            } else {
                if (res && res.success) {
                    this.autoPassword = false;
                    this.authService.setUserData(res.data);
                    this.router.navigate(['/u/dashboard']);
                    this.initSideNavMenu();
                }
            }
        });
    }
}
