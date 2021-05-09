import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbDialogService, NbMediaBreakpointsService, NbMenuItem, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';
import { LayoutService } from 'src/app/@core/utils';
import { map, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { AuthService } from 'src/app/@core/services/auth.service';
import { menuWhenLoggedIn, menuWhenNotLogin, MENU_KEY } from 'src/app/@core/constants/menu.constant';
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

    currentTheme = 'corporate';

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
        this.menuService.onItemClick().subscribe((event) => this.menuClickHandler(event.item));
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
                                if (event.url === '/project') {
                                    this.sidebarService.sendChangeMenuStatus(MENU_KEY.PROJECT_WITHOUT_CHILD, true);
                                } else {
                                    this.sidebarService.sendChangeMenuStatus(MENU_KEY.PROJECT, true);
                                }
                            } else {
                                this.sidebarService.sendChangeMenuStatus(MENU_KEY.PROJECT_WITHOUT_CHILD, false);
                                this.sidebarService.sendChangeMenuStatus(MENU_KEY.PROJECT, false);
                            }
                        }
                    });
            }
        });
    }

    ngOnInit() {
        this.userLanguage = this.authService.getUserLang() ?? 'en';
        this.authService.setUserLang(this.userLanguage);
        this.listenProfileChange();
        this.listenLanguageChange();
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

    listenLanguageChange(): void {
        this.langTranslateService.getCurrentLangRequest().subscribe((language) => {
            this.userLanguage = language;
            this.langTranslateService.translateMenu(language, this.menuWhenLoggedIn);
            this.langTranslateService.translateMenu(language, this.menuWhenNotLogin);
        });
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

    menuClickHandler(menuItem: any): void {
        switch (menuItem.key) {
            case MENU_KEY.LOGIN:
                this.router.navigate(['/auth/login']);
                break;
            case MENU_KEY.REGISTER:
                this.router.navigate(['/auth/register']);
                break;
            case MENU_KEY.LOGOUT:
                this.authService.logoutUser();
                this.utilsService.showToast(SUCCESS, 'Logout successfully.');
                break;
            case MENU_KEY.CHANGE_PASSWORD:
                const autoPassword = this.authService.getUserData().autoPassword;
                this.dialogService.open(UserChangePasswordComponent, {
                    closeOnBackdropClick: !autoPassword,
                    closeOnEsc: !autoPassword
                });
                break;
            case MENU_KEY.PROFILE:
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
    }
}
