import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMenuItem, NbMenuService, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { Subscription } from 'rxjs';
import { LoaderService } from 'src/app/@core/services';
import { AuthService } from 'src/app/@core/services/auth.service';

interface TreeNode<T> {
    data: T;
    children?: TreeNode<T>[];
    expanded?: boolean;
}

interface FSEntry {
    fullName: string;
    email: string;
    phone: string;
    userData: any;
}
@Component({
    selector: 'app-admin-manage-user',
    templateUrl: './manage-user.component.html'
})
export class AdminManageUserComponent implements OnInit, OnDestroy {
    checked: boolean;
    columns = ['fullName', 'email', 'phone', 'action'];
    columnNames = ['Full Name', 'Email', 'Phone', 'Action'];
    tableData: Array<TreeNode<FSEntry>>;
    data: NbTreeGridDataSource<FSEntry>;
    menuItems: Array<NbMenuItem> = [{ title: 'Verify' }];
    menuClickSubscription: Subscription;
    rowUser: any;
    dataFound: boolean;
    totalData: number;

    constructor(private readonly authService: AuthService, private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>, private readonly menuService: NbMenuService, public loaderService: LoaderService) {}

    ngOnInit(): void {
        this.getAllUsers({ verified: false });
        this.initMenu();
    }

    ngOnDestroy(): void {
        this.menuClickSubscription.unsubscribe();
    }

    initMenu(): void {
        this.menuClickSubscription = this.menuService.onItemClick().subscribe(({ item }) => {
            switch (item.title) {
                case 'Verify':
                    this.authService.verifyUser(this.rowUser._id).subscribe((res) => {
                        if (res && res.success) {
                            this.tableData = this.tableData.filter((tableRow) => tableRow.data.userData._id !== this.rowUser._id);
                            this.data = this.dataSourceBuilder.create(this.tableData);
                        }
                    });
                    break;
                default:
                    break;
            }
        });
    }

    getAllUsers(query: any) {
        this.loaderService.startLoader();
        this.authService.getAllUser(query).subscribe(
            (res) => {
                this.loaderService.stopLoader();
                if (res && res.success) {
                    this.dataFound = res.data.length ? true : false;
                    this.totalData = res.data.length;
                    this.tableData = this.createTreeGridDataArray(res.data);
                    this.data = this.dataSourceBuilder.create(this.tableData);
                }
            },
            (err) => {
                this.dataFound = false;
                this.totalData = 0;
                this.loaderService.stopLoader();
            }
        );
    }

    createTreeGridDataArray(users: Array<any>) {
        return users.map((user) => {
            const rowData: TreeNode<FSEntry> = {
                data: {
                    fullName: user.fullName,
                    email: user.email,
                    phone: user.phone,
                    userData: user
                }
            };
            return rowData;
        });
    }

    onCheckedChange(checked: boolean): void {
        this.menuItems = checked ? [{ title: 'Unverify' }, { title: 'Block' }] : [{ title: 'Verify' }, { title: 'Block' }];
        this.getAllUsers({ verified: checked });
    }

    openMenu(userData: any): void {
        this.rowUser = userData;
    }
}
