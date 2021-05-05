import { NgModule } from '@angular/core';
import { COMMON_MODULE } from 'src/app/@core/constants/common-shared.constant';
import { NEBULAR_COMPONENTS_MODULE } from 'src/app/@core/constants/nebular.constant';
import { EditTimelinePointComponent } from './edit-timeline-point/edit-timeline-point.component';
import { FamilyTimelineProjectComponent } from './family-timeline-project/family-timeline-project.component';
import { TimelineProjectFormComponent } from './family-timeline-project/timeline-project-form/timeline-project-form.component';
import { FamilyTimelineRoutingModule } from './family-timeline-routing.module';
import { FamilyTimelineComponent } from './family-timeline.component';
import { ManageTimelineComponent } from './manage-timeline/manage-timeline.component';
import { NewTimelinePointComponent } from './new-timeline-point/new-timeline-point.component';
import { TimelineEventFormComponent } from './timeline-event-form/timeline-event-form.component';
import { TimelinePointFormComponent } from './timeline-point-form/timeline-point-form.component';
import { TimelineComponent } from './timeline/timeline.component';

@NgModule({
    imports: [FamilyTimelineRoutingModule, ...COMMON_MODULE, ...NEBULAR_COMPONENTS_MODULE],
    declarations: [FamilyTimelineComponent, FamilyTimelineProjectComponent, TimelineProjectFormComponent, TimelineComponent, TimelinePointFormComponent, TimelineEventFormComponent, ManageTimelineComponent, NewTimelinePointComponent, EditTimelinePointComponent]
})
export class FamilyTimelineModule {}
