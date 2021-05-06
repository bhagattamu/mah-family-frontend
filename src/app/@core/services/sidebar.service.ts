import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { MenuItem, MENU_KEY } from '../constants/menu.constant';

@Injectable({
    providedIn: 'root'
})
export class SidebarService {
    menuKeySubject: BehaviorSubject<any> = new BehaviorSubject<any>({});
    projectSubject: Subject<string> = new Subject<string>();

    sendChangeMenuStatus(menuKey: string, status: boolean): void {
        this.menuKeySubject.next({ key: menuKey, status: status });
    }

    get menuKeySubject$(): Observable<any> {
        return this.menuKeySubject.asObservable();
    }

    sendProjectId(projectId: string): void {
        this.projectSubject.next(projectId);
    }

    get projectSubject$(): Observable<any> {
        return this.projectSubject.asObservable();
    }

    changeMenuStatus(menus: Array<MenuItem>, key: string, status: boolean): void {
        menus.forEach((menuItem: MenuItem) => {
            if (menuItem.key === key) {
                menuItem.hidden = !status;
            }
            if (key === MENU_KEY.PROJECT && menuItem.key === MENU_KEY.PROJECT_WITHOUT_CHILD) {
                menuItem.hidden = status;
            }
            if (key === MENU_KEY.PROJECT_WITHOUT_CHILD && menuItem.key === MENU_KEY.PROJECT) {
                menuItem.hidden = status;
            }
        });
    }

    replaceProjectLink(menus: Array<MenuItem>, projectId: string): void {
        menus.forEach((menuItem: MenuItem) => {
            if (menuItem.key === MENU_KEY.PROJECT) {
                menuItem.hidden = false;
                menuItem.children.forEach((projectMenuItem: MenuItem) => {
                    projectMenuItem.link = projectMenuItem.link.replace('{{projectId}}', projectId);
                });
            }
        });
    }
}
