import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbDialogService, NbMediaBreakpointsService, NbMenuItem, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';

import { LayoutService } from '../../../@core/utils';
import { map, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { AuthService } from 'src/app/@core/services/auth.service';
import { menuWhenLoggedIn, menuWhenNotLogin } from 'src/app/@core/constants/menu.constant';
import { SUCCESS } from 'src/app/@core/constants/toast.constant';
import { LangTranslateService, SidebarService, UtilsService } from 'src/app/@core/services';
import { Event, NavigationEnd, Router } from '@angular/router';
import { UserChangePasswordComponent } from 'src/app/pages/after-login/user/change-password/change-password.component';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'ngx-header',
    styleUrls: ['./header.component.scss'],
    templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();
    login$: Observable<boolean>;
    menuWhenNotLogin: NbMenuItem[] = [...menuWhenNotLogin];
    menuWhenLoggedIn: NbMenuItem[] = [...menuWhenLoggedIn];
    userData: any;
    HOST_URL: string = environment.HOST_URL;
    profilePictureURL: string;
    userPictureOnly: boolean = false;
    activeProject: boolean;
    hasSideNavMenu: boolean;
    userLanguage: string;

    themes = [
        {
            value: 'default',
            name: 'Light'
        },
        {
            value: 'dark',
            name: 'Dark'
        },
        {
            value: 'cosmic',
            name: 'Cosmic'
        },
        {
            value: 'corporate',
            name: 'Corporate'
        }
    ];

    currentTheme = 'default';

    userMenu = [{ title: 'Profile' }, { title: 'Log out' }];

    constructor(
        public translate: TranslateService,
        private authService: AuthService,
        private nbSidebarService: NbSidebarService,
        private menuService: NbMenuService,
        private themeService: NbThemeService,
        private layoutService: LayoutService,
        private breakpointService: NbMediaBreakpointsService,
        private utilsService: UtilsService,
        private router: Router,
        private dialogService: NbDialogService,
        private sidebarService: SidebarService,
        private langTranslateService: LangTranslateService
    ) {
        this.login$ = this.authService.getLoginStatus();
        this.menuService.onItemClick().subscribe((event) => this.menuClickHandler(event.item.title));
        this.login$.subscribe((res) => {
            if (res) {
                this.userData = this.authService.getUserData();
                this.profilePictureURL = `${environment.API_HOST}/files/user-picture/${this.userData.id}/${this.userData.profileImageURL}`;
                this.authService.getProfilePicture(this.userData.id, this.userData.profileImageURL).subscribe(
                    () => {},
                    (err) => {
                        if (err.statusCode === 404) {
                            this.profilePictureURL = '/assets/images/subjects/default-user-image.png';
                        }
                    }
                );
                this.router.events
                    .pipe(
                        map((event) => event),
                        takeUntil(this.destroy$)
                    )
                    .subscribe((event: Event) => {
                        if (event instanceof NavigationEnd) {
                            if (event.url.includes('/project')) {
                                this.activeProject = true;
                            } else {
                                this.sidebarService.removeProjectMenu();
                                this.activeProject = false;
                            }
                        }
                    });
            }
        });
    }

    ngOnInit() {
        this.initSideNav();
        this.userLanguage = this.authService.getUserLang();
        this.listenProfileChange();
        this.currentTheme = this.themeService.currentTheme;

        const { xl } = this.breakpointService.getBreakpointsMap();
        this.themeService
            .onMediaQueryChange()
            .pipe(
                map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
                takeUntil(this.destroy$)
            )
            .subscribe((isLessThanXl: boolean) => (this.userPictureOnly = isLessThanXl));

        this.themeService
            .onThemeChange()
            .pipe(
                map(({ name }) => name),
                takeUntil(this.destroy$)
            )
            .subscribe((themeName) => (this.currentTheme = themeName));
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    changeTheme(themeName: string) {
        this.themeService.changeTheme(themeName);
    }

    toggleSidebar(): boolean {
        this.nbSidebarService.toggle(true, 'menu-sidebar');
        this.layoutService.changeLayoutSize();
        return false;
    }

    navigateHome() {
        this.router.navigate(['/home']);
        return false;
    }

    initSideNav(): void {
        this.sidebarService.sidebarMenus$.subscribe(
            (menuItems) => {
                if (menuItems['admin']?.length || menuItems['project']?.length) {
                    this.hasSideNavMenu = true;
                } else {
                    this.hasSideNavMenu = false;
                }
            },
            (err) => {
                this.hasSideNavMenu = false;
            }
        );
    }

    menuClickHandler(menuTitle: string): void {
        switch (menuTitle) {
            case 'Login':
                this.router.navigate(['/auth/login']);
                break;
            case 'Register':
                this.router.navigate(['/auth/register']);
                break;
            case 'Logout':
                this.authService.logoutUser();
                this.utilsService.showToast(SUCCESS, 'Logout successfully.');
                break;
            case 'Change Password':
                const autoPassword = this.authService.getUserData().autoPassword;
                this.dialogService.open(UserChangePasswordComponent, {
                    closeOnBackdropClick: !autoPassword,
                    closeOnEsc: !autoPassword
                });
                break;
            case 'Profile':
                this.router.navigate(['/user/profile']);
                break;
            default:
                break;
        }
    }

    listenProfileChange(): void {
        this.authService.getNewProfileURL().subscribe((newProfile) => {
            if (newProfile) {
                this.userData = this.authService.getUserData();
                this.profilePictureURL = `${environment.API_HOST}/files/user-picture/${this.userData.id}/${this.userData.profileImageURL}`;
                this.authService.getProfilePicture(this.userData.id, this.userData.profileImageURL).subscribe(
                    () => {},
                    (err) => {
                        if (err.statusCode === 404) {
                            this.profilePictureURL = `/assets/images/subjects/default-user-image.png`;
                        }
                    }
                );
            }
        });
    }

    onChangeLanguage(lang: any) {
        this.authService.setUserLang(lang);
        this.langTranslateService.sendChangeRequest(lang);
        this.userLanguage = lang;
    }

    onNavigateProject(): void {
        this.activeProject = true;
    }
}
