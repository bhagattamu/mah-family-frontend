import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AfterLoginComponent } from './after-login.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
    {
        path: '',
        component: AfterLoginComponent,
        children: [
            {
                path: '',
                redirectTo: 'dashboard'
            },
            {
                path: 'dashboard',
                component: DashboardComponent
            },
            {
                path: 'project',
                loadChildren: async () => (await import('./project/project.module')).ProjectModule
            },
            {
                path: 'admin',
                loadChildren: async () => (await import('./admin/admin.module')).AdminModule
            },
            {
                path: 'user',
                loadChildren: async () => (await import('./user/user.module')).UserModule
            },
            {
                path: 'language',
                loadChildren: async () => (await import('./language/language.module')).LanguageModule
            }
        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AfterLoginRoutingModule {}
