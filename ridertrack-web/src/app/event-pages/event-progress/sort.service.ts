import { Injectable } from '@angular/core';
import {Subject} from "rxjs/Subject";

export interface ColumnSortedEvent {
  sortColumn : string;
  sortDirection: string;
}

@Injectable()
export class SortService {

  constructor() { }

  private columnSortedSource = new Subject<ColumnSortedEvent>();

  columnSorted$ = this.columnSortedSource.asObservable();

  columnSorted(event: ColumnSortedEvent){
    this.columnSortedSource.next(event);
  }

  sortTable(criteria: SearchCriteria, table: any) {
   return table.sort((a,b) => {
     if(criteria.sortDirection === 'desc'){
       return a[criteria.sortColumn] < b[criteria.sortColumn] ? 1 : -1;
     }else {
      return  a[criteria.sortColumn] > b[criteria.sortColumn]? 1 : -1;
     }
    });
  }
}
export class SearchCriteria {
  sortColumn: string;
  sortDirection: string;
}



