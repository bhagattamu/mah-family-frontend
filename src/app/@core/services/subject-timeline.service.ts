import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '.';
import { URL_CONSTANT } from '../constants/url.constant';

@Injectable({
    providedIn: 'root'
})
export class SubjectTimelineService {
    constructor(private readonly http: HttpService) {}

    createTimelineProject(timelineProjectDto: any): Observable<any> {
        return this.http.post(URL_CONSTANT.TIMELINE_BASE, timelineProjectDto);
    }

    updateTimelineProject(timelineProjectId: string, updateTimelineProjectDto: any): Observable<any> {
        return this.http.put(URL_CONSTANT.TIMELINE_BASE + `/${timelineProjectId}`, updateTimelineProjectDto);
    }

    getAllTimelineProject(projectId: string): Observable<any> {
        return this.http.get(URL_CONSTANT.TIMELINE_BASE + '/all', { projectId });
    }

    getTimelineProjectById(timelineProjectId: string): Observable<any> {
        return this.http.get(URL_CONSTANT.TIMELINE_BASE + `/${timelineProjectId}`);
    }

    createTimelinePoint(timelinePointDto: any): Observable<any> {
        return this.http.post(URL_CONSTANT.TIMELINE_BASE + '/point', timelinePointDto);
    }

    getTimelineById(timelineId: string, timelineProjectId: string): Observable<any> {
        return this.http.get(URL_CONSTANT.TIMELINE_BASE + '/point/' + timelineId, { timelineProjectId });
    }

    updateTimelineById(timelineId: string, timelineProjectId: string, updateTimelineDto: any): Observable<any> {
        return this.http.put(URL_CONSTANT.TIMELINE_BASE + '/point/' + timelineId + `?timelineProjectId=${timelineProjectId}`, updateTimelineDto);
    }

    deleteTimelinePointById(timelinePointId: string, timelineProjectId: string): Observable<any> {
        return this.http.delete(URL_CONSTANT.TIMELINE_BASE + '/point/' + timelinePointId, { timelineProjectId });
    }

    // createTimelineOfSubject(timeline: any): Observable<any> {
    //     return this.http.post(URL_CONSTANT.TIMELINE_BASE, timeline);
    // }
}
