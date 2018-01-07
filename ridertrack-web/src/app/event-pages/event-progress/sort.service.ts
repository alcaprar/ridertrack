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

  /**
   *  Sort the table given the column parameter
   * @param {SearchCriteria} criteria : column
   * @param table: object to sort
   */
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
      console.log("[Open][Sort]");
      return table.sort((a,b) => {
        let data_a;
        let data_b;
        if(a.enrollmentOpeningAt){
          data_a = new Date(a.enrollmentOpeningAt);
        }else {
          data_a = new Date();
        }
        if(b.enrollmentOpeningAt) {
          data_b = new Date(b.enrollmentOpeningAt);
        }else {
          data_b = new Date();
        }

        if(criteria.sortDirection === 'desc'){
          return this.date_sort_desc(data_a, data_b);
        }else {
          return this.date_sort_asc(data_a, data_b);
        }
      });
    }
    if(criteria.sortColumn === 'close'){
      console.log("[Close][Sort]");
      return table.sort((a,b) => {
        let data_a;
        let data_b;
        if(a.enrollmentClosingAt){
          data_a = new Date(a.enrollmentClosingAt);
        }else {
          data_a = new Date();
        }
        if(b.enrollmentClosingAt) {
          data_b = new Date(b.enrollmentClosingAt);
        }else {
          data_b = new Date();
        }
        if(criteria.sortDirection === 'desc'){
          return this.date_sort_desc(data_a, data_b);
        }else {
          return this.date_sort_asc(data_a, data_b);
        }
      });
    }
    if(criteria.sortColumn === 'length'){
      let length;
      console.log("[Sort][Length]");
      return table.sort((a, b) => {
        if(a.length){
          length = a.length;
        }else {
          length =0;
        }
        if(b.length){
          length = b.length;
        }else {
          length =0;
        }
        if (criteria.sortDirection === 'desc') {
          return a.length < b.length ? 1 : -1;
        } else {
          return a.length > b.length ? 1 : -1;
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
    console.log("[Date_Sort_Asc][Date1]", date1);
    console.log("[Date_Sort_Asc][Date2]", date2);
    if(date1 > date2) return 1;
    if(date1 < date2) return -1;
    return 0;
  }

  date_sort_desc(date1, date2){
    console.log("[Date_Sort_Desc][Date1]", date1);
    console.log("[Date_Sort_Desc][Date2]", date2);
    if(date1 > date2) return -1;
    if(date1 < date2) return 1;
    return 0;
  }
}
export class SearchCriteria {
  sortColumn: string;
  sortDirection: string;
}



