import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SUCCESS, WARNING } from 'src/app/@core/constants/toast.constant';
import { LoaderService, UtilsService } from 'src/app/@core/services';
import { LanguageService } from 'src/app/@core/services/language.service';

@Component({
    selector: 'app-language-form',
    templateUrl: './language-form.component.html'
})
export class LanguageFormComponent implements OnInit {
    @Output() onCreate = new EventEmitter();
    languageFormGroup: FormGroup;
    submitted: boolean;
    searchStringChanged: Subject<any> = new Subject<any>();
    options: Array<any>;
    filteredNgModelOptions$: Observable<string[]>;
    loading: boolean;
    longitude: number;
    latitude: number;

    constructor(private readonly fb: FormBuilder, private readonly languageService: LanguageService, private readonly loaderService: LoaderService, private readonly utilsService: UtilsService) {
        this.searchStringChanged.pipe(debounceTime(1000), distinctUntilChanged()).subscribe((searchString) => {
            this.search(searchString);
        });
    }

    ngOnInit(): void {
        this.options = [];
        this.buildLanguageForm();
    }

    buildLanguageForm(): void {
        this.languageFormGroup = this.fb.group({
            languageName: ['', [Validators.required]],
            languageDescription: [''],
            origin: this.fb.group({
                location: this.fb.group({
                    longitude: [''],
                    latitude: [''],
                    address: ['']
                }),
                description: ['']
            })
        });
    }

    get LanguageFormGroup() {
        return this.languageFormGroup.controls;
    }

    onChangeLocation(locationInfo: any): void {
        const origin = this.languageFormGroup.get('origin');
        const location = origin.get('location');
        location.patchValue({
            longitude: locationInfo.longitude,
            latitude: locationInfo.latitude
        });
    }

    onChangeCoordinateFromInput(value: number, type: string): void {
        this[type] = value;
    }

    private filter(value: string): string[] {
        return this.options.filter((option) => option.languageName.toUpperCase().includes(value.toUpperCase()));
    }

    onChangeLanguageName(value: any): void {
        const found = this.options.find((option) => option.languageName.toUpperCase().includes(value.toUpperCase()));
        if (!found && value) {
            this.searchStringChanged.next(value);
        }
        this.filteredNgModelOptions$ = of(this.filter(value));
        if (!value) {
            this.options = [];
            this.filteredNgModelOptions$ = of(this.options);
        }
    }

    onSelectChange(id: string): void {
        // if (id) {
        //     this.vaccineOutreachId = id;
        // }
        // this.value = '';
        // this.options = [];
        // this.filteredNgModelOptions$ = of(this.options);
    }

    search(queryString: string): void {
        // this.action = 'search';
        this.loading = true;
        this.languageService.searchLanguageByName({ languageName: queryString }).subscribe(
            (res) => {
                this.loading = false;
                if (res && res.success) {
                    this.options = res.data;
                    this.filteredNgModelOptions$ = of(this.options);
                } else {
                    this.options = [];
                }
            },
            (err) => {
                this.loading = false;
            }
        );
    }

    onSubmit({ value, valid }): void {
        if (!valid) {
            return;
        }
        this.loaderService.startLoader();
        this.languageService.createLanguage(value).subscribe(
            (res) => {
                this.loaderService.stopLoader();
                if (res && res.success) {
                    this.utilsService.showToast(SUCCESS, res.message[0]);
                    this.onCreate.emit(res.data);
                } else {
                    this.utilsService.showToast(WARNING, 'FAILED');
                }
            },
            (err) => {
                this.utilsService.showToast(WARNING, err.message);
                this.loaderService.stopLoader();
            }
        );
    }
}
