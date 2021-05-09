import { Component } from '@angular/core';

@Component({
    selector: 'app-before-login',
    template: `
        <ngx-before-login-column-layout>
            <router-outlet></router-outlet>
        </ngx-before-login-column-layout>
    `
})
export class BeforeLoginComponent {}
