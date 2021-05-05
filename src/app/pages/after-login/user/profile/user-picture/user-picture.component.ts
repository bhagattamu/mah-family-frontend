import { Component, OnInit } from '@angular/core';
import { NbDialogService, NbMenuItem } from '@nebular/theme';
import { AuthService } from 'src/app/@core/services/auth.service';
import { environment } from 'src/environments/environment';
import { ViewPictureComponent } from './view-picture/view-picture.component';

@Component({
    selector: 'app-user-picture',
    templateUrl: './user-picture.component.html',
    styleUrls: ['./user-picture.scss']
})
export class UserPictureComponent implements OnInit {
    pictures: Array<string>;
    menuItems: Array<NbMenuItem> = [
        {
            title: 'Make Profile Picture'
        },
        {
            title: 'Delete'
        }
    ];
    selectedPicture: string;

    constructor(private readonly authService: AuthService, private readonly dialogService: NbDialogService) {}

    ngOnInit(): void {
        this.getAllPictures();
    }

    getAllPictures(): void {
        this.authService.getAllUserPictures(this.authService.getUserData().id).subscribe((res) => {
            this.pictures = res.map((picture) => environment.API_HOST + `/files/user-picture/${this.authService.getUserData().id}/${picture}`);
        });
    }

    openMenu(selectedPicture: string): void {
        this.selectedPicture = selectedPicture;
    }

    openImage(picture: string): void {
        this.dialogService.open(ViewPictureComponent, { context: { imageURL: picture } });
    }
}
