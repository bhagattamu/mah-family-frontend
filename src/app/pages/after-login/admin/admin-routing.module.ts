import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from 'src/app/@core/guards/role.guard';
import { AdminDashboardComponent } from './dashboard/dashboard.component';
import { AdminManageUserComponent } from './manage-user/manage-user.component';

const ROUTES: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: AdminDashboardComponent,
                canActivate: [RoleGuard],
                data: { role: ['admin'] }
            },
            {
                path: 'manage-user',
                component: AdminManageUserComponent,
                canActivate: [RoleGuard],
                data: { role: ['admin'] }
            }
        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(ROUTES)],
    exports: [RouterModule]
})
export class AdminRoutingModule {}
