import { NgModule } from '@angular/core';
import { COMMON_MODULE } from 'src/app/@core/constants/common-shared.constant';
import { NEBULAR_COMPONENTS_MODULE } from 'src/app/@core/constants/nebular.constant';
import { OSMMapComponent } from './common/osm/osm.component';
import { PromptYesNoComponent } from './common/prompt-yes-no/prompt-yes-no.component';

@NgModule({
    imports: [...COMMON_MODULE, ...NEBULAR_COMPONENTS_MODULE],
    declarations: [PromptYesNoComponent, OSMMapComponent],
    exports: [PromptYesNoComponent, OSMMapComponent]
})
export class SharedModule {}
