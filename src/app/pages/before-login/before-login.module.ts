import { NgModule } from '@angular/core';
import { COMMON_MODULE } from 'src/app/@core/constants/common-shared.constant';
import { NEBULAR_COMPONENTS_MODULE } from 'src/app/@core/constants/nebular.constant';
import { ThemeModule } from 'src/app/@theme/theme.module';
import { BeforeLoginRoutingModule } from './before-login-routing.module';
import { BeforeLoginComponent } from './before-login.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

@NgModule({
    declarations: [BeforeLoginComponent, LandingPageComponent],
    imports: [BeforeLoginRoutingModule, ...COMMON_MODULE, ...NEBULAR_COMPONENTS_MODULE, ThemeModule]
})
export class BeforeLoginModule {}
