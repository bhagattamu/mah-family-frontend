import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
    selector: 'app-prompt-yes-no',
    templateUrl: './prompt-yes-no.component.html'
})
export class PromptYesNoComponent {
    question: string;

    constructor(private dialogRef: NbDialogRef<PromptYesNoComponent>) {}

    onAnswer(answer: boolean): void {
        this.dialogRef.close(answer);
    }
}
