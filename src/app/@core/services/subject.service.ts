import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URL_CONSTANT } from '../constants/url.constant';
import { HttpService } from './http.service';

@Injectable({ providedIn: 'root' })
export class SubjectService {
    constructor(private httpService: HttpService) {}

    createSubject(subject: any, hasFormData: boolean): Observable<any> {
        return this.httpService.post(URL_CONSTANT.SUBJECT_BASE, subject, hasFormData);
    }

    createSpouse(subject: any, hasFormData: boolean, mateId: string): Observable<any> {
        return this.httpService.post(URL_CONSTANT.SUBJECT_BASE + `/spouse/${mateId}`, subject, hasFormData);
    }

    createChild(subject: any, hasFormData: boolean, parentId: string): Observable<any> {
        return this.httpService.post(URL_CONSTANT.SUBJECT_BASE + `/child/${parentId}`, subject, hasFormData);
    }

    getSubjectById(subjectId: string): Observable<any> {
        return this.httpService.get(URL_CONSTANT.SUBJECT_BASE + `/${subjectId}`);
    }

    getSubjectByProjectId(projectId: string): Observable<any> {
        return this.httpService.get(URL_CONSTANT.SUBJECT_BASE + `/project/${projectId}`);
    }

    getTreeDataFromRoot(rootId: string): Observable<any> {
        return this.httpService.get(URL_CONSTANT.SUBJECT_BASE + `/family-tree/${rootId}`);
    }
}
