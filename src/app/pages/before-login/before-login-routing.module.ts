import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BeforeLoginComponent } from './before-login.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

const routes: Routes = [
    {
        path: '',
        component: BeforeLoginComponent,
        children: [
            {
                path: '',
                redirectTo: 'home'
            },
            {
                path: 'home',
                component: LandingPageComponent
            },
            {
                path: 'auth',
                loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule)
            }
        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BeforeLoginRoutingModule {}
