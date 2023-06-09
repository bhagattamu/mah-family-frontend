import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { BeforeLoginGuard } from './@core/guards/before-login.guard';
import { LoginGuard } from './@core/guards/login.guard';
import { PageNotFoundComponent } from './pages/miscellaneous/page-not-found/page-not-found.component';

const config: ExtraOptions = {
    useHash: true
};
const routes: Routes = [
    {
        path: '',
        loadChildren: async () => import('./pages/before-login/before-login.module').then((m) => m.BeforeLoginModule),
        canActivate: [BeforeLoginGuard]
    },
    {
        path: '',
        loadChildren: () => import('./pages/after-login/after-login.module').then((m) => m.AfterLoginModule),
        canActivate: [LoginGuard]
    },
    {
        path: '**',
        component: PageNotFoundComponent
    }
];
@NgModule({
    imports: [RouterModule.forRoot(routes, config)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
