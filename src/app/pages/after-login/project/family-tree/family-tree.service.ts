import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FamilyTreeService {
    getById = (id: string, dataArray: any) => {
        return dataArray.filter((data: any) => data._id === id)[0];
    };

    getFullName = (firstName: string, lastName: string) => {
        return `${firstName} ${lastName}`;
    };

    addClass = (...classes: Array<string>) => {
        let classString = '';
        classes.forEach((className) => (classString += className + ' '));
        return classString;
    };

    constructTreeData = (data: any, rootId: string) => {
        let rootData = this.getById(rootId, data);
        let tree = {
            name: this.getFullName(rootData.firstName, rootData.lastName),
            class: this.addClass(rootData.gender, rootData?.dateOfDeath === '_' ? 'alive' : 'death'),
            extra: {
                ...rootData
            },
            marriages:
                rootData.marriages.length > 0
                    ? rootData.marriages.map(({ spouse, childrens }) => {
                          const rootSpouse = this.getById(spouse, data);
                          return {
                              spouse: {
                                  name: this.getFullName(rootSpouse.firstName, rootSpouse.lastName),
                                  class: this.addClass(rootSpouse.gender, rootSpouse?.dateOfDeath === '_' ? 'alive' : 'death'),
                                  extra: {
                                      ...rootSpouse
                                  }
                              },
                              children: childrens.map((child) => {
                                  return this.constructTreeData(data, child.children);
                              })
                          };
                      })
                    : []
        };
        return tree;
    };
}
