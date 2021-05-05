import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TreeDataService {
    private treeData = new BehaviorSubject([]);

    setNewTreeData(data: any): void {
        this.treeData.next(data);
    }

    getTreeData(): Observable<any> {
        return this.treeData.asObservable();
    }
}
