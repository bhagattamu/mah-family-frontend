import { Component } from '@angular/core';

@Component({
    selector: 'ngx-footer',
    styleUrls: ['./footer.component.scss'],
    template: `
        <span class="created-by">
            Created with ♥ by
            <b><a href="https://bhagatgurung.com.np" target="_blank">Ancestor Culture</a></b>
            2021
        </span>
        <div class="socials">
            <a href="#" target="_blank">
                <nb-icon icon="facebook-outline"></nb-icon>
            </a>
            <a href="#" target="_blank">
                <nb-icon icon="linkedin-outline"></nb-icon>
            </a>
            <a href="#" target="_blank">
                <nb-icon icon="github-outline"></nb-icon>
            </a>
        </div>
    `
})
export class FooterComponent {}
