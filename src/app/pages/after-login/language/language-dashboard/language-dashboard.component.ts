import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/@core/services/language.service';

@Component({
    selector: 'app-language-dashboard',
    templateUrl: 'language-dashboard.component.html',
    styleUrls: ['./language-dashboard.component.scss']
})
export class LanguageDashboardComponent implements OnInit {
    activeForm: boolean;
    forkedLanguages: Array<any>;

    constructor(private readonly languageService: LanguageService) {}

    ngOnInit(): void {
        this.getAllForkedLanguages();
    }

    onCreateLanguage(newLanguage: any) {
        this.activeForm = false;
    }

    onAdd(): void {
        this.activeForm = true;
    }
    onCancel(): void {
        this.activeForm = false;
    }

    getAllForkedLanguages(): void {
        this.languageService.getAllForkedLanguages().subscribe((res) => {
            if (res && res.success && res.data) {
                this.forkedLanguages = res.data.forkedLanguages;
            }
        });
    }
}
