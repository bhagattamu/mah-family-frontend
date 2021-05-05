import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { RecoveryCodeComponent } from './recovery-code/recovery-code.component';
import { RegisterComponent } from './register/register.component';
import { RequestPasswordComponent } from './request-password/request-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ThankYouComponent } from './thank-you/thank-you.component';

const routes: Routes = [
    {
        path: '',
        component: AuthComponent,
        children: [
            {
                path: '',
                redirectTo: 'login'
            },
            {
                path: 'login',
                component: LoginComponent
            },
            {
                path: 'register',
                component: RegisterComponent
            },
            {
                path: 'request-recovery',
                component: RequestPasswordComponent
            },
            {
                path: 'recovery-code/:userId',
                component: RecoveryCodeComponent
            },
            {
                path: 'recovery/password',
                component: ResetPasswordComponent
            },
            {
                path: 'thank-you',
                component: ThankYouComponent
            }
        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule {}
