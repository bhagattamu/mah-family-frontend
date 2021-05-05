import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SelectProjectComponent } from 'src/app/pages/after-login/project/select-project/select-project.component';
import { EditTimelinePointComponent } from './edit-timeline-point/edit-timeline-point.component';
import { FamilyTimelineProjectComponent } from './family-timeline-project/family-timeline-project.component';
import { FamilyTimelineComponent } from './family-timeline.component';
import { ManageTimelineComponent } from './manage-timeline/manage-timeline.component';
import { NewTimelinePointComponent } from './new-timeline-point/new-timeline-point.component';
import { TimelineComponent } from './timeline/timeline.component';

const ROUTES: Routes = [
    {
        path: '',
        component: FamilyTimelineComponent,
        children: [
            {
                path: '',
                component: SelectProjectComponent
            },
            {
                path: 'new-timeline/:timelineProjectId',
                component: NewTimelinePointComponent
            },
            {
                path: 'edit-timeline/:timelineProjectId',
                component: EditTimelinePointComponent
            },
            {
                path: 'manage-timeline/:timelineProjectId',
                component: ManageTimelineComponent
            },
            {
                path: 'timeline/view',
                component: TimelineComponent
            },
            {
                path: ':projectId',
                component: FamilyTimelineProjectComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(ROUTES)],
    exports: [RouterModule]
})
export class FamilyTimelineRoutingModule {}
