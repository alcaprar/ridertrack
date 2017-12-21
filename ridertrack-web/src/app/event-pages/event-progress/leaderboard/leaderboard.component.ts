import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {SortService} from "../sort.service";

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {

  private eventId;
  private started: boolean = true;
  private mockParticipants: Ranking[] = [
    {position: '1', name: 'Tom',surname: 'Delonge'},
    {position: '2', name: 'Alicia',surname: 'Jasmin'},
    {position: '3', name: 'Mark',surname: 'Thomson'}
  ];
  constructor(private route: ActivatedRoute, private sortService: SortService) { }

  ngOnInit() {
    this.route.parent.params.subscribe(params => {
      this.eventId = params['eventId'];
      console.log('[Leaderboard][OnInit][EventId]', this.eventId);
      this.sortService.sortParticipants({sortColumn: 'position', sortDirection:'asc'}, this.mockParticipants);
    });
  }

  onSorted($event){
    this.sortService.sortParticipants($event, this.mockParticipants);
  }
}
export class SearchCriteria {
  sortColumn: string;
  sortDirection: string;
}

export class Ranking {
  position: string;
  name:string;
  surname:string;
}
