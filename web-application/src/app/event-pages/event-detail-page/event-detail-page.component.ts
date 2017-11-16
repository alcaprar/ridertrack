import { Component, OnInit } from '@angular/core';
import {UserService} from '../../shared/services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {EventService} from '../../shared/services/event.service';
import {User} from '../../shared/models/user';
import {Event} from '../../shared/models/event';

@Component({
  selector: 'app-event-detail-page',
  templateUrl: './event-detail-page.component.html',
  styleUrls: ['./event-detail-page.component.css']
})
export class EventDetailPageComponent implements OnInit {

  currentEvent: Event;
  currentUser: User;
  organizer: User;
  errorMessage: String;

  constructor(private userService: UserService, private route: ActivatedRoute, private eventService: EventService) {
  }

  ngOnInit() {
    this.getEventDetail(this.route.snapshot.params['id']);
    this.getOrganizerDetail();
  }

  getEventDetail(id): void {
    this.eventService.getEvent(id)
      .then((event) => this.currentEvent = event,
        (error) => this.errorMessage = <any> error
      );
  }

  getOrganizerDetail() {
    const id = this.currentEvent.organizerID;
    this.userService.getUser()
      .subscribe(
        (user: User) =>{
          
        }
      )
  }

}


