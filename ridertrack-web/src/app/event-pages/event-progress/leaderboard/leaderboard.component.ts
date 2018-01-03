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

  private eventId;
  private currentEvent = new Event();
  private ranking: any = [];
  private started: boolean;


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
        this.eventService.getRanking(this.eventId).then((users)=> {
          for(let i=1; i<= users.length; i++){
            this.ranking.add({position: i, name: users[i].name, surname: users[i].surname});
          }
          console.log("[LeaderBoard][Ranking][OnInit]", this.ranking);
          this.sortService.sortParticipants({sortColumn: 'position', sortDirection:'asc'}, this.ranking);
        })
      }else {
        this.started = false;
        console.log("[LeaderBoard][Ranking][EventNotStarted]");
      }
    })
  }
  onSorted($event){
    this.sortService.sortParticipants($event, this.ranking);
  }
}
export class SearchCriteria {
  sortColumn: string;
  sortDirection: string;
}

