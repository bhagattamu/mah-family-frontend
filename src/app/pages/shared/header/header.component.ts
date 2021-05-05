import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { NbDialogService, NbMenuItem, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { menuWhenNotLogin, menuWhenLoggedIn } from 'src/app/@core/constants/menu.constant';
import { SUCCESS } from 'src/app/@core/constants/toast.constant';
import { UtilsService, LangTranslateService, SidebarService } from 'src/app/@core/services';
import { AuthService } from 'src/app/@core/services/auth.service';
import { environment } from 'src/environments/environment';
import { UserChangePasswordComponent } from '../../after-login/user/change-password/change-password.component';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
    @Input() brandName: string;
    login$: Observable<boolean>;
    userLanguage: string;
    userData: any;
    menuWhenNotLogin: NbMenuItem[] = [...menuWhenNotLogin];
    menuWhenLoggedIn: NbMenuItem[] = [...menuWhenLoggedIn];
    HOST_URL: string = environment.HOST_URL;
    profilePictureURL: string;
    routerEventSubscription: Subscription;
    activeProject: boolean;
    hasSideMenu: boolean;

    constructor(
        private themeService: NbThemeService,
        public translate: TranslateService,
        private menuService: NbMenuService,
        private router: Router,
        private authService: AuthService,
        private utilsService: UtilsService,
        private readonly nbSidebarService: NbSidebarService,
        private langTranslateService: LangTranslateService,
        private readonly dialogService: NbDialogService,
        private readonly sidebarService: SidebarService
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
                this.routerEventSubscription = this.router.events.subscribe((event: Event) => {
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

    ngOnInit(): void {
        this.initSideNav();
        this.userLanguage = this.authService.getUserLang();
        this.listenProfileChange();
        // this.toggleTheme('dark');
    }

    ngOnDestroy(): void {
        if (this.routerEventSubscription) {
            this.routerEventSubscription.unsubscribe();
        }
    }

    initSideNav(): void {
        this.sidebarService.sidebarMenus$.subscribe(
            (menuItems) => {
                if (menuItems['admin']?.length || menuItems['project']?.length) {
                    this.hasSideMenu = true;
                } else {
                    this.hasSideMenu = false;
                }
            },
            (err) => {
                this.hasSideMenu = false;
            }
        );
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

    toggleTheme(theme: string): void {
        this.themeService.changeTheme(theme);
    }

    menuClickHandler(menuTitle: string): void {
        switch (menuTitle) {
            case 'Switch Theme':
                this.toggleTheme(this.themeService.currentTheme === 'dark' ? 'corporate' : 'dark');
                break;
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
                this.dialogService.open(UserChangePasswordComponent, { closeOnBackdropClick: !autoPassword, closeOnEsc: !autoPassword });
                break;
            case 'Profile':
                this.router.navigate(['/user/profile']);
                break;
            default:
                break;
        }
    }

    toggleSideBar(): void {
        this.nbSidebarService.toggle(false);
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
