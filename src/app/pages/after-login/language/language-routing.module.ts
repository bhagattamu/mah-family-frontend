import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LanguageDashboardComponent } from './language-dashboard/language-dashboard.component';

const ROUTES: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: LanguageDashboardComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(ROUTES)],
    exports: [RouterModule]
})
export class LanguageRoutingModule {}
