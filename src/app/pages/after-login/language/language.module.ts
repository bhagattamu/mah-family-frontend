import { NgModule } from '@angular/core';
import { COMMON_MODULE } from 'src/app/@core/constants/common-shared.constant';
import { NEBULAR_COMPONENTS_MODULE } from 'src/app/@core/constants/nebular.constant';
import { SharedModule } from '../../shared/shared.module';
import { LanguageDashboardComponent } from './language-dashboard/language-dashboard.component';
import { LanguageFormComponent } from './language-dashboard/language-form/language-form.component';
import { LanguageRoutingModule } from './language-routing.module';
import { LanguageComponent } from './language.component';

@NgModule({
    imports: [LanguageRoutingModule, ...COMMON_MODULE, ...NEBULAR_COMPONENTS_MODULE, SharedModule],
    declarations: [LanguageComponent, LanguageDashboardComponent, LanguageFormComponent]
})
export class LanguageModule {}
