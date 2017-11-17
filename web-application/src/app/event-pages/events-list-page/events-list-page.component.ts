import { Component, OnInit } from '@angular/core';
import {EventService} from '../../shared/services/event.service';
import {UserService} from '../../shared/services/user.service';
import {User} from '../../shared/models/user';
import {Event} from '../../shared/models/event';
import {Router} from "@angular/router";

@Component({
  selector: 'app-events-list-page',
  templateUrl: './events-list-page.component.html',
  styleUrls: ['./events-list-page.component.css']
})
export class EventsListPageComponent implements OnInit {

  currentUser: User;
  eventList: Event[];
  selectedEvent: Event;

  constructor(private eventService: EventService, private userService: UserService, private router: Router) { }

  // When the component is created saves the list of all events and the current user
  ngOnInit() {
    this.eventService.getAllEvents().then(events => {
     this.eventList = events;
    });
    this.userService.getUser().subscribe(user => this.currentUser = user);
  }

}
