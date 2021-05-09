import { Component, OnInit } from '@angular/core';
import { MENU_KEY } from 'src/app/@core/constants/menu.constant';
import { LangTranslateService } from 'src/app/@core/services';
import { AuthService } from 'src/app/@core/services/auth.service';

@Component({
    selector: 'app-user-profile',
    templateUrl: './profile.component.html'
})
export class UserProfileComponent implements OnInit {
    profileTabs: Array<any>;
    languageMenuStatus: boolean;

    constructor(private readonly authService: AuthService, private langTranslateService: LangTranslateService) {}

    ngOnInit(): void {
        this.initTabs();
        this.authService.getLanguageInformationMenuStatus().subscribe((status) => {
            this.languageMenuStatus = status;
            this.initTabs();
        });
    }

    initTabs(): void {
        this.profileTabs = [
            {
                title: 'Basic Information',
                route: '/user/profile/basic-information',
                icon: 'person-outline',
                responsive: true,
                key: MENU_KEY.BASIC_INFORMATION
            },
            {
                title: 'Family Information',
                route: '/user/profile/family-information',
                icon: 'heart-outline',
                responsive: true,
                disabled: false,
                key: MENU_KEY.FAMILY_INFORMATION
            },
            {
                title: 'Language Information',
                route: '/user/profile/language-information',
                icon: 'info-outline',
                responsive: true,
                disabled: !this.languageMenuStatus,
                key: MENU_KEY.LANGUAGE_INFORMATION
            },
            {
                title: 'Pictures',
                route: '/user/profile/pictures',
                icon: 'attach-outline',
                responsive: true,
                disabled: false,
                key: MENU_KEY.PICTURES
            }
        ];
        this.langTranslateService.getCurrentLangRequest().subscribe((language) => {
            this.langTranslateService.translateTab(language, this.profileTabs);
        });
    }
}
