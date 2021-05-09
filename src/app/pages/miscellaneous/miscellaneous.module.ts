import { NgModule } from '@angular/core';
import { COMMON_MODULE } from 'src/app/@core/constants/common-shared.constant';
import { DataNotFoundComponent } from './data-not-found/data-not-found.component';
import { LoaderComponent } from './loader/loader.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

@NgModule({
    imports: [...COMMON_MODULE],
    declarations: [LoaderComponent, DataNotFoundComponent, PageNotFoundComponent],
    exports: [LoaderComponent, DataNotFoundComponent, PageNotFoundComponent]
})
export class MiscellaneousModule {}
