import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from 'src/app/@core/guards/role.guard';
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
                loadChildren: async () => (await import('./project/project.module')).ProjectModule,
                canActivate: [RoleGuard],
                data: { role: ['user', 'admin'] }
            },
            {
                path: 'admin',
                loadChildren: async () => (await import('./admin/admin.module')).AdminModule,
                canActivate: [RoleGuard],
                data: { role: ['admin'] }
            },
            {
                path: 'user',
                loadChildren: async () => (await import('./user/user.module')).UserModule,
                canActivate: [RoleGuard],
                data: { role: ['user', 'admin'] }
            },
            {
                path: 'language',
                loadChildren: async () => (await import('./language/language.module')).LanguageModule,
                canActivate: [RoleGuard],
                data: { role: ['user', 'admin'] }
            }
        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AfterLoginRoutingModule {}
