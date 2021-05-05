import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectRoutingComponent } from './project-routing.component';
import { ProjectComponent } from './project-list/project.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { SubjectComponent } from './subject/subject.component';
import { FamilyTreeComponent } from './family-tree/family-tree.component';
import { SelectProjectComponent } from './select-project/select-project.component';
import { ProjectDashboardComponent } from './project-dashboard/project-dashboard.component';

const routes: Routes = [
    {
        path: '',
        component: ProjectRoutingComponent,
        children: [
            {
                path: '',
                component: ProjectDashboardComponent
            },
            {
                path: 'add',
                component: ProjectComponent
            },
            {
                path: 'subject',
                component: SelectProjectComponent
            },
            {
                path: 'subject/:projectId',
                component: SubjectComponent
            },
            {
                path: 'family-tree',
                component: SelectProjectComponent
            },
            {
                path: 'family-tree/:projectId',
                children: [
                    {
                        path: '',
                        component: SubjectComponent
                    },
                    {
                        path: ':rootId',
                        component: FamilyTreeComponent
                    }
                ]
            },
            {
                path: 'timeline-project',
                loadChildren: async () => (await import('./family-timeline/family-timeline.module')).FamilyTimelineModule
            },
            {
                path: ':projectId',
                component: ProjectDetailComponent
            }
        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProjectRoutingModule {}
