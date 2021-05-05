import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { COMMON_MODULE } from 'src/app/@core/constants/common-shared.constant';
import { NEBULAR_COMPONENTS_MODULE } from 'src/app/@core/constants/nebular.constant';
import { ThemeModule } from 'src/app/@theme/theme.module';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { RecoveryCodeComponent } from './recovery-code/recovery-code.component';
import { RegisterComponent } from './register/register.component';
import { RequestPasswordComponent } from './request-password/request-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ThankYouComponent } from './thank-you/thank-you.component';

@NgModule({
  imports: [
    AuthRoutingModule,
    ...COMMON_MODULE,
    ...NEBULAR_COMPONENTS_MODULE,
    TranslateModule.forChild(),
    ThemeModule,
  ],
  declarations: [
    AuthComponent,
    LoginComponent,
    RegisterComponent,
    RequestPasswordComponent,
    RecoveryCodeComponent,
    ResetPasswordComponent,
    ThankYouComponent,
  ],
})
export class AuthModule {}
