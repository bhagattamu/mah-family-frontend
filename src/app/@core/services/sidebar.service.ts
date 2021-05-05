import { Injectable } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class SidebarService {
    sidebarMenus = new BehaviorSubject<any>({
        admin: [],
        project: [],
        common: [
            {
                title: 'About Us',
                link: '/about',
                icon: 'people-outline'
            },
            {
                title: 'Contact Us',
                link: '/contact-us',
                icon: 'phone-outline'
            }
        ]
    });
    constructor(private readonly authService: AuthService) {
        if (this.authService.isAdmin()) {
            this.addAdminMenu();
        } else {
            this.sidebarMenus.next({ ...this.sidebarMenus.value, ['admin']: [] });
        }
    }

    addAdminMenu(): void {
        const adminMenus: Array<NbMenuItem> = [
            {
                title: 'Admin',
                icon: 'shield-outline',
                children: [
                    {
                        title: 'Dashboard',
                        link: '/admin',
                        pathMatch: 'full',
                        icon: 'home-outline'
                    },
                    {
                        title: 'Manage User',
                        link: '/admin/manage-user',
                        pathMatch: 'prefix',
                        icon: 'settings-outline'
                    }
                ]
            }
        ];
        this.setSidebarMenus('admin', adminMenus);
    }

    addProjectMenu(projectId: string): void {
        const projectMenus: Array<NbMenuItem> = [
            {
                title: 'Project',
                icon: 'folder-outline',
                expanded: true,
                children: [
                    {
                        title: 'Projects',
                        link: `/project`,
                        icon: 'briefcase-outline',
                        pathMatch: 'full'
                    },
                    {
                        title: 'Subject',
                        link: `/project/subject/${projectId}`,
                        icon: 'person-outline',
                        pathMatch: 'prefix'
                    },
                    {
                        title: 'Family Tree',
                        link: `/project/family-tree/${projectId}`,
                        icon: 'arrowhead-up-outline',
                        pathMatch: 'prefix'
                    },
                    {
                        title: 'Family Timeline',
                        link: `/project/timeline-project/${projectId}`,
                        icon: 'clock-outline',
                        pathMatch: 'prefix'
                    }
                ]
            }
        ];
        this.setSidebarMenus('project', projectMenus);
    }

    removeProjectMenu(): void {
        this.sidebarMenus.next({ ...this.sidebarMenus.value, project: [] });
    }

    get sidebarMenus$(): Observable<Array<NbMenuItem>> {
        return this.sidebarMenus.asObservable();
    }

    setSidebarMenus(type: string, menuItems: Array<NbMenuItem>): void {
        this.sidebarMenus.next({ ...this.sidebarMenus.value, [type]: menuItems });
    }
}
