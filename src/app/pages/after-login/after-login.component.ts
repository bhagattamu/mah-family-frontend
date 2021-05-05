import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService, NbMenuItem, NbSidebarService } from '@nebular/theme';
import { delay } from 'rxjs/operators';
import { SidebarService } from 'src/app/@core/services';
import { AuthService } from 'src/app/@core/services/auth.service';
import { UserChangePasswordComponent } from './user/change-password/change-password.component';

@Component({
    selector: 'app-after-login',
    template: `
        <ngx-one-column-layout>
            <nb-menu [items]="sideNavMenus"></nb-menu>
            <router-outlet></router-outlet>
        </ngx-one-column-layout>
    `,
    styleUrls: ['./after-login.component.scss']
})
export class AfterLoginComponent implements OnInit {
    autoPassword: boolean;
    sideNavMenus: Array<NbMenuItem> = [{ title: 'Hell' }];
    constructor(private readonly authService: AuthService, private readonly dialogService: NbDialogService, private readonly router: Router, private sidebarService: SidebarService, private nbSidebarService: NbSidebarService) {
        this.autoPassword = this.authService.getUserData().autoPassword;
    }

    ngOnInit(): void {
        if (this.autoPassword) {
            this.openChangePassword();
        } else {
            this.initSideNavMenu();
        }
    }

    initSideNavMenu(): void {
        this.sidebarService.sidebarMenus$.pipe(delay(0)).subscribe(
            (menuItems) => {
                console.log(menuItems);
                this.sideNavMenus = [...menuItems['admin'], ...(menuItems['project'].length ? menuItems['project'] : [{ title: 'Project', link: '/project', icon: 'folder-outline' }]), ...menuItems['common']];
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
                }
            }
        });
    }
}
