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

  constructor(private userService: UserService, private route: ActivatedRoute, private eventService: EventService) {
  }

  // When the component is created catch the current event object and the current user
  ngOnInit() {
    this.eventService.getEvent(this.route.snapshot.params['id']).then((event) => this.currentEvent = event);
    this.userService.getUser().subscribe((user) => this.currentUser = user);
  }


}


