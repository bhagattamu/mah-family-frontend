import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AuthInterceptor } from './@core/interceptors/auth.interceptor';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { CoreModule } from './@core/core.module';
import { NEBULAR_COMPONENTS_MODULE, NEBULAR_ROOT_MODULE } from './@core/constants/nebular.constant';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './pages/shared/shared.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ThemeModule } from './@theme/theme.module';
import { MiscellaneousModule } from './pages/miscellaneous/miscellaneous.module';

@NgModule({
    declarations: [AppComponent],
    imports: [
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (http: HttpClient) => {
                    return new TranslateHttpLoader(http);
                },
                deps: [HttpClient]
            }
        }),
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        SharedModule,
        ...NEBULAR_ROOT_MODULE,
        ...NEBULAR_COMPONENTS_MODULE,
        CoreModule.forRoot(),
        ThemeModule.forRoot(),
        MiscellaneousModule
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
