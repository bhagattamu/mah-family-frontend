import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
    selector: 'app-view-picture',
    templateUrl: 'view-picture.component.html',
    styleUrls: ['../user-picture.scss']
})
export class ViewPictureComponent {
    imageURL: string;

    constructor(private readonly dialogRef: NbDialogRef<ViewPictureComponent>) {}

    closeModal(): void {
        this.dialogRef.close();
    }
}
