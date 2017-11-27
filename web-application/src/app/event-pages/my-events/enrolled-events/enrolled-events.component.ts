import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../../authentication/authentication.service";
import {EventService} from "../../../shared/services/event.service";

@Component({
  selector: 'app-enrolled-events',
  templateUrl: './enrolled-events.component.html',
  styleUrls: ['./enrolled-events.component.css']
})
export class EnrolledEventsComponent implements OnInit {


  private enrolledEvents: Event[] = [];

  constructor(private authService: AuthenticationService, private eventService: EventService) { }

  ngOnInit() {
    this.getEnrolledEvents(this.authService.getUserId());
  }

  getEnrolledEvents(id){
    this.eventService.getEnrolledEventsForUser(id).then(
      (events: Event[]) =>{
        console.log('[My-Events][OnInit][getEnrolledEventsForUser][success]', events);
        this.enrolledEvents = events
      }
    )
      .catch(
        (error) =>{
          console.log('[My-Events][OnInit][getEnrolledEventsForUser][error]', error);
        }
      )
  }

}
