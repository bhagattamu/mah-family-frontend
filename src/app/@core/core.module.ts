import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { throwIfAlreadyLoaded } from './guards/module-imports.guard';
import { AnalyticsService, LayoutService, SeoService, StateService } from './utils';

export const NB_CORE_PROVIDERS = [AnalyticsService, LayoutService, SeoService, StateService];
@NgModule({
    imports: [CommonModule, HttpClientModule, TranslateModule.forChild()],
    declarations: []
})
export class CoreModule {
    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        throwIfAlreadyLoaded(parentModule, 'CoreModule');
    }

    static forRoot(): any {
        return {
            ngModule: CoreModule,
            providers: [...NB_CORE_PROVIDERS]
        };
    }
}
