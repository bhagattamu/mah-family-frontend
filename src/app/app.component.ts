import { Component, OnDestroy, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { LangTranslateService, LocalStorageService } from './@core/services';
import { NavigationEnd, Router, Event } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
// import { Title } from '@angular/platform-browser';
// import { CommonService } from './@core/utils';
import { AuthService } from './@core/services/auth.service';
import { AnalyticsService, SeoService } from './@core/utils';

declare global {
    interface Window {
        d3: any;
    }
}
@Component({
    selector: 'app-root',
    // templateUrl: './app.component.html',
    template: `<router-outlet></router-outlet>`,
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    login$: Observable<boolean>;
    brandName = 'Ancestor Culture';
    langTranslateServiceSubscription: Subscription | undefined;
    routerEventSubscription: Subscription;

    constructor(
        private authService: AuthService,
        private translate: TranslateService,
        private analytics: AnalyticsService,
        private seoService: SeoService,
        // private titleService: Title,
        public router: Router,
        private localStorageService: LocalStorageService,
        private langTranslateService: LangTranslateService // private commonService: CommonService
    ) {
        this.login$ = this.authService.getLoginStatus();
        window.d3 = d3;
        window._ = _;
        this.translate.addLangs(['en', 'ne']);
        this.translate.setDefaultLang('en');
        const userLang = this.localStorageService.getItem('language');
        if (!userLang) {
            this.localStorageService.setItem('language', 'en');
        }
        this.translate.use(userLang ? userLang : 'en');

        this.routerEventSubscription = this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationEnd) {
                // this.titleService.setTitle(
                //   this.commonService.getTitleByUrl(
                //     event.urlAfterRedirects,
                //     this.localStorageService.getItem('language')
                //       ? this.localStorageService.getItem('language')
                //       : 'en'
                //   ) +
                //     ' | ' +
                //     this.brandName
                // );
            }
        });
    }

    ngOnInit(): void {
        this.langTranslateServiceSubscription = this.langTranslateService.getCurrentLangRequest().subscribe((lang) => {
            this.translate.use(lang);
        });
        this.analytics.trackPageViews();
        this.seoService.trackCanonicalChanges();
    }

    ngOnDestroy(): void {
        this.routerEventSubscription.unsubscribe();
        if (this.langTranslateServiceSubscription) {
            this.langTranslateServiceSubscription.unsubscribe();
        }
    }
}
