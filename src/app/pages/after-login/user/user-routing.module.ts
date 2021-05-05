import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BasicInformationComponent } from './profile/basic-information/basic-information.component';
import { FamilyInformationComponent } from './profile/family-information/family-information.component';
import { LanguageInformationComponent } from './profile/language-information/language-information.component';
import { UserProfileComponent } from './profile/profile.component';
import { UserPictureComponent } from './profile/user-picture/user-picture.component';

const ROUTES: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: UserProfileComponent
            },
            {
                path: 'profile',
                component: UserProfileComponent,
                children: [
                    {
                        path: '',
                        redirectTo: 'basic-information'
                    },
                    {
                        path: 'basic-information',
                        component: BasicInformationComponent
                    },
                    {
                        path: 'family-information',
                        component: FamilyInformationComponent
                    },
                    {
                        path: 'language-information',
                        component: LanguageInformationComponent
                    },
                    {
                        path: 'pictures',
                        component: UserPictureComponent
                    }
                ]
            }
        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(ROUTES)],
    exports: [RouterModule]
})
export class UserRoutingModule {}
