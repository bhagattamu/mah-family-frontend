import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/@core/services/auth.service';

@Component({
    selector: 'app-user-profile',
    templateUrl: './profile.component.html'
})
export class UserProfileComponent implements OnInit {
    profileTabs: Array<any>;
    languageMenuStatus: boolean;

    constructor(private readonly authService: AuthService) {}

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
                responsive: true
            },
            {
                title: 'Family Information',
                route: '/user/profile/family-information',
                icon: 'heart-outline',
                responsive: true,
                disabled: false
            },
            {
                title: 'Language Information',
                route: '/user/profile/language-information',
                icon: 'info-outline',
                responsive: true,
                disabled: !this.languageMenuStatus
            },
            {
                title: 'Pictures',
                route: '/user/profile/pictures',
                icon: 'attach-outline',
                responsive: true,
                disabled: false
            }
        ];
    }
}
