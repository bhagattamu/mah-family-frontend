import { NgModule } from '@angular/core';
import { COMMON_MODULE } from 'src/app/@core/constants/common-shared.constant';
import { NEBULAR_COMPONENTS_MODULE } from 'src/app/@core/constants/nebular.constant';
import { ThemeModule } from 'src/app/@theme/theme.module';
import { AfterLoginRoutingModule } from './after-login-routing.module';
import { AfterLoginComponent } from './after-login.component';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
    declarations: [AfterLoginComponent, DashboardComponent],
    imports: [AfterLoginRoutingModule, ...COMMON_MODULE, ...NEBULAR_COMPONENTS_MODULE, ThemeModule]
})
export class AfterLoginModule {}
