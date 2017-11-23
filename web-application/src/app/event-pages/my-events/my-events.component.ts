import { Component, OnInit } from '@angular/core';
import {UserService} from '../../shared/services/user.service';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {EventService} from '../../shared/services/event.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {User} from '../../shared/models/user';
import {Event} from '../../shared/models/event';

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.css']
})
export class MyEventsComponent implements OnInit {

  // currentUserId: any;
  organizedEvents: any;

  constructor(private userService: UserService, private route: ActivatedRoute,
     private eventService: EventService, private authService: AuthenticationService) { }

  ngOnInit() {
    // this.currentUserId = this.authService.getUserId();
    this.getOrganizedEvents(this.authService.getUserId());
  }

  getOrganizedEvents(id){
    this.organizedEvents = this.eventService.getOrganizedEventsForUser(id);
    console.log(this.eventService.getOrganizedEventsForUser(id));
    console.log(this.organizedEvents);

  }

}
