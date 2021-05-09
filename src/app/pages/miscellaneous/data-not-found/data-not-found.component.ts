import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-data-not-found',
    templateUrl: './data-not-found.component.html',
    styleUrls: ['../miscellaneous.scss']
})
export class DataNotFoundComponent {
    @Input() type: string;
}
