import { Component, OnInit } from '@angular/core';
import {UserService} from '../../shared/services/user.service';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
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

  constructor(private userService: UserService, private route: ActivatedRoute,
              private eventService: EventService, private location: Location) {
  }

  // When the component is created catch the current event object and the current user
  ngOnInit() {
    this.getEvent();
    this.userService.getUser().subscribe((user) => this.currentUser = user);
  }

  /**
   *  Get the event from the server calling the associated method in the EventService
   *  and stores it in the 'currentEvent' variable.
   *  id: it is taken from the url of the route /event/:id
   */
  getEvent() :void {
    const id= +this.route.snapshot.paramMap.get('id');
    this.eventService.getEvent(id).then((event) => this.currentEvent = event);
    console.log('[EventDetailComponent][getEvent][success]', this.currentEvent);
  }

}


