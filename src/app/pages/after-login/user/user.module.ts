import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { COMMON_MODULE } from 'src/app/@core/constants/common-shared.constant';
import { NEBULAR_COMPONENTS_MODULE } from 'src/app/@core/constants/nebular.constant';
import { UserChangePasswordComponent } from './change-password/change-password.component';
import { BasicInformationComponent } from './profile/basic-information/basic-information.component';
import { FamilyInformationComponent } from './profile/family-information/family-information.component';
import { LanguageInformationComponent } from './profile/language-information/language-information.component';
import { UserProfileComponent } from './profile/profile.component';
import { UserPictureComponent } from './profile/user-picture/user-picture.component';
import { ViewPictureComponent } from './profile/user-picture/view-picture/view-picture.component';
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';

@NgModule({
    imports: [UserRoutingModule, ...COMMON_MODULE, ...NEBULAR_COMPONENTS_MODULE, TranslateModule.forChild()],
    declarations: [UserComponent, UserProfileComponent, UserChangePasswordComponent, BasicInformationComponent, UserPictureComponent, ViewPictureComponent, FamilyInformationComponent, LanguageInformationComponent]
})
export class UserModule {}
