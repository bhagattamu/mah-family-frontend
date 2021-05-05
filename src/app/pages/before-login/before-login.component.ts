import { Component } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';

@Component({
    selector: 'app-before-login',
    template: `
        <ngx-before-login-column-layout>
            <router-outlet></router-outlet>
        </ngx-before-login-column-layout>
    `
})
export class BeforeLoginComponent {}
