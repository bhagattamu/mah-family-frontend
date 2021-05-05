import { NgModule } from '@angular/core';
import { COMMON_MODULE } from 'src/app/@core/constants/common-shared.constant';
import { NEBULAR_COMPONENTS_MODULE } from 'src/app/@core/constants/nebular.constant';
import { OSMMapComponent } from './common/osm/osm.component';
import { PromptYesNoComponent } from './common/prompt-yes-no/prompt-yes-no.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { SideNavComponent } from './side-nav/side-nav.component';

@NgModule({
    imports: [...COMMON_MODULE, ...NEBULAR_COMPONENTS_MODULE],
    declarations: [HeaderComponent, FooterComponent, SideNavComponent, PromptYesNoComponent, OSMMapComponent],
    exports: [HeaderComponent, FooterComponent, SideNavComponent, PromptYesNoComponent, OSMMapComponent]
})
export class SharedModule {}
