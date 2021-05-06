import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalStorageService } from './localstorage.service';
import { LOCAL_STORAGE_ITEM } from '../constants/local-storage.constant';
import { URL_CONSTANT } from '../constants/url.constant';
import { HttpService } from './http.service';
import { SidebarService } from './sidebar.service';

@Injectable({ providedIn: 'root' })
export class ProjectService {
    constructor(private readonly httpService: HttpService, private readonly localStorageService: LocalStorageService, private readonly sidebarService: SidebarService) {}

    private projectId: string | undefined;

    createProject(project: any): Observable<any> {
        return this.httpService.post(URL_CONSTANT.PROJECT_BASE, project);
    }

    editProject(projectId: string, editProjectDto: any): Observable<any> {
        return this.httpService.put(URL_CONSTANT.PROJECT_BASE + `/${projectId}`, editProjectDto);
    }

    getAllProjectsInvolved(): Observable<any> {
        return this.httpService.get(URL_CONSTANT.PROJECT_BASE + '/user/all');
    }

    getProjectById(projectId: string): Observable<any> {
        return this.httpService.get(URL_CONSTANT.PROJECT_BASE + `/${projectId}`);
    }

    setCurrentRunningProject(projectId: string): void {
        const data = {
            projectId,
            userId: this.localStorageService.getItem(LOCAL_STORAGE_ITEM.USER_DATA)?.id
        };
        this.localStorageService.setItem(LOCAL_STORAGE_ITEM.SELECTED_PROJECT, JSON.stringify(data));
    }

    getCurrentRunningProject(): any {
        const dataInString = this.localStorageService.getItem(LOCAL_STORAGE_ITEM.SELECTED_PROJECT);
        if (dataInString) {
            return JSON.parse(dataInString);
        } else {
            return null;
        }
    }

    initSidenav(projectId: string, first?: boolean): void {
        if (projectId !== this.projectId || first) {
            if (projectId) {
                this.projectId = projectId;
                this.sidebarService.sendProjectId(projectId);
            }
        }
    }
}
