import { NgModule } from '@angular/core';
import { COMMON_MODULE } from 'src/app/@core/constants/common-shared.constant';
import { NEBULAR_COMPONENTS_MODULE } from 'src/app/@core/constants/nebular.constant';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { AdminDashboardComponent } from './dashboard/dashboard.component';
import { AdminManageUserComponent } from './manage-user/manage-user.component';

@NgModule({
    imports: [AdminRoutingModule, ...COMMON_MODULE, ...NEBULAR_COMPONENTS_MODULE],
    declarations: [AdminComponent, AdminDashboardComponent, AdminManageUserComponent]
})
export class AdminModule {}
