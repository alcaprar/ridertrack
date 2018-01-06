import { Injectable } from '@angular/core';
import {Subject} from "rxjs/Subject";
import {DatePipe} from "@angular/common";

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
    if(criteria.sortColumn === 'date'){
      console.log("[created array of dates", table);
      return table.sort((a,b) => {
        if(criteria.sortDirection === 'desc'){
          return this.date_sort_desc(a.startingDate, b.startingDate);
        }else {
          return this.date_sort_asc(a.startingDate, b.startingDate);
        }
      });
    }
    if(criteria.sortColumn === 'open'){
      return table.sort((a,b) => {
        let data_a;
        let data_b;
        if(a.enrollmentOpeningAt){
          data_a = new DatePipe('en-US').transform(a.enrollmentOpeningAt, 'dd/MM/yyyy');
        }else {
          data_a = '30/12/2200';
        }
        if(b.enrollmentOpeningAt) {
          data_b = new DatePipe('en-US').transform(b.enrollmentOpeningAt, 'dd/MM/yyyy');
        }else {
         data_b = '30/12/2200';
        }
        if(criteria.sortDirection === 'desc'){
          return this.date_sort_desc(data_a, data_b);
        }else {
          return this.date_sort_asc(data_a, data_b);
        }
      });
    }
    if(criteria.sortColumn === 'close'){
      return table.sort((a,b) => {
        let data_a;
        let data_b;
        if(a.enrollmentClosingAt){
          data_a = new DatePipe('en-US').transform(a.enrollmentClosingAt, 'dd/MM/yyyy');
        }else {
          data_a = '30/12/2200';
        }
        if(b.enrollmentClosingAt) {
          data_b = new DatePipe('en-US').transform(b.enrollmentClosingAt, 'dd/MM/yyyy');
        }else {
          data_b = '30/12/2200';
        }
        if(criteria.sortDirection === 'desc'){
          return this.date_sort_desc(data_a, data_b);
        }else {
          return this.date_sort_asc(data_a, data_b);
        }
      });
    }
    else {
      return table.sort((a, b) => {
        if (criteria.sortDirection === 'desc') {
          return a[criteria.sortColumn] < b[criteria.sortColumn] ? 1 : -1;
        } else {
          return a[criteria.sortColumn] > b[criteria.sortColumn] ? 1 : -1;
        }
      });
    }
  }

  date_sort_asc(date1, date2){
    if(date1 > date2) return 1;
    if(date1 < date2) return -1;
    return 0;
  }

  date_sort_desc(date1, date2){
    if(date1 > date2) return -1;
    if(date1 < date2) return 1;
    return 0;
  }
}
export class SearchCriteria {
  sortColumn: string;
  sortDirection: string;
}



