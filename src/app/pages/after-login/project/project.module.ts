import { NgModule } from '@angular/core';
import { COMMON_MODULE } from 'src/app/@core/constants/common-shared.constant';
import { NEBULAR_COMPONENTS_MODULE } from 'src/app/@core/constants/nebular.constant';
import { ProjectRoutingComponent } from './project-routing.component';
import { ProjectRoutingModule } from './project-routing.module';
import { ProjectComponent } from './project-list/project.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { ProjectDetailCardComponent } from './project-detail-card/project-detail-card.component';
import { SubjectComponent } from './subject/subject.component';
import { AddNewProjectComponent } from './project-list/add-new-project/add-new-project.component';
import { AddNewSubjectComponent } from './subject/add-new-subject/add-new-subject.component';
import { FamilyTreeComponent } from './family-tree/family-tree.component';
import { TreeNodeComponent } from './family-tree/tree-node/tree-node.component';
import { FamilyTreeContextMenuComponent } from './family-tree/context-menu/context-menu.component';
import { AddNewSpouseComponent } from './subject/add-new-spouse/add-new-spouse.component';
import { AddNewChildrenComponent } from './subject/add-new-children/add-new-children.component';
import { PrintFamilyTreeButtonComponent } from './family-tree/print-button/print-family-tree-button.component';
import { ProjectDashboardComponent } from './project-dashboard/project-dashboard.component';
import { SharedModule } from '../../shared/shared.module';
import { ProjectCardComponent } from './project-card/project-card.component';
import { SelectProjectComponent } from './select-project/select-project.component';
import { ThemeModule } from 'src/app/@theme/theme.module';
import { ProjectFormComponent } from './project-form/project-form.component';
import { MiscellaneousModule } from 'src/app/pages/miscellaneous/miscellaneous.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [
        ProjectRoutingComponent,
        ProjectDashboardComponent,
        ProjectComponent,
        AddNewProjectComponent,
        ProjectDetailComponent,
        ProjectDetailCardComponent,
        ProjectCardComponent,
        SubjectComponent,
        AddNewSubjectComponent,
        AddNewSpouseComponent,
        AddNewChildrenComponent,
        FamilyTreeComponent,
        TreeNodeComponent,
        FamilyTreeContextMenuComponent,
        PrintFamilyTreeButtonComponent,
        SelectProjectComponent,
        ProjectFormComponent
    ],
    imports: [ProjectRoutingModule, ...COMMON_MODULE, ...NEBULAR_COMPONENTS_MODULE, SharedModule, ThemeModule, MiscellaneousModule, TranslateModule]
})
export class ProjectModule {}
