import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {SortService} from "../sort.service";
import {EventService} from "../../../shared/services";
import {Event, User} from "../../../shared/models";

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {

  public eventId;
  public currentEvent = new Event();
  public ranking: any = [];
  public started: boolean;

  public refreshInterval;


  constructor(private route: ActivatedRoute, private sortService: SortService, private eventService: EventService) { }

  ngOnInit() {
    this.route.parent.params.subscribe(params => {
      this.eventId = params['eventId'];
      this.getCurrentEvent();
      console.log('[Leaderboard][OnInit][EventId]', this.eventId);
    });
  }

  getCurrentEvent() {
    this.eventService.getEvent(this.eventId).then((event)=> {
      this.currentEvent = event;
      if(event.status === 'ongoing'){
        this.started = true;
        console.log("[LeaderBoard][Ranking][EventStarted]", this.currentEvent.status);
        this.refreshInterval = setInterval(this.eventService.getRanking(this.eventId).then((users)=> {
          for(let i=0; i< users.length; i++){
            this.ranking.push({position: i+1, name: users[i].name, surname: users[i].surname});
          }
          console.log("[LeaderBoard][Ranking][OnInit]", this.ranking);
          this.sortService.sortTable({sortColumn: 'position', sortDirection:'asc'}, this.ranking);
        }),5 * 1000 );
      }
      if(event.status === 'passed') {
        this.started = false;
        console.log("[LeaderBoard][Ranking][EventPassed]");
      }
      if(event.status === 'planned') {
        this.started = false;
        console.log("[LeaderBoard][Ranking][EventNotStarted]");
      }
    })
  }
  onSorted($event){
    this.sortService.sortTable($event, this.ranking);
  }
}
export class SearchCriteria {
  sortColumn: string;
  sortDirection: string;
}

