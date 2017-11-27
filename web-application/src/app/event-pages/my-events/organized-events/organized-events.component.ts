import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../../authentication/authentication.service";
import {EventService} from "../../../shared/services/event.service";

@Component({
  selector: 'app-organized-events',
  templateUrl: './organized-events.component.html',
  styleUrls: ['./organized-events.component.css']
})
export class OrganizedEventsComponent implements OnInit {


  private organizedEvents: Event[] = [];

  constructor(private authService: AuthenticationService, private eventService: EventService) {

  }

  ngOnInit() {
    this.getOrganizedEvents(this.authService.getUserId());
  }

  getOrganizedEvents(id) {
    this.eventService.getOrganizedEventsForUser(id).then(
      (events: Event[]) => {
        console.log('[My-Events][OnInit][getOrganizedEventsForUser][success]', events);
        this.organizedEvents = events
      }
    )
      .catch(
        (error) => {
          console.log('[My-Events][OnInit][getOrganizedEventsForUser][error]', error);
        }
      )
  }

}
