import {Component, HostListener, Input, OnDestroy, OnInit} from '@angular/core';
import {SortService} from "../sort.service";
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: '[sortable-column]',
  templateUrl: './sortable-column.component.html'
})
export class SortableColumnComponent implements OnInit, OnDestroy {

  constructor( private sortService: SortService) { }

  @Input('sortable-column')
  public columnName: string;

  @Input('sort-direction')
  public sortDirection: string ='';

  public columnSortedSubscription: Subscription;

  @HostListener('click')
  sort() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.sortService.columnSorted({sortColumn: this.columnName, sortDirection: this.sortDirection})
  }

  ngOnInit() {
    this.columnSortedSubscription = this.sortService.columnSorted$.subscribe(event => {
      if(this.columnName != event.sortColumn){
        this.sortDirection = '';
      }
    });
  }

  ngOnDestroy() {
    this.columnSortedSubscription.unsubscribe();
  }

}
