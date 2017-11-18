import { Component, OnInit } from '@angular/core';
import {UserService} from '../../shared/services/user.service';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {EventService} from '../../shared/services/event.service';
import {User} from '../../shared/models/user';
import {Event} from '../../shared/models/event';

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.css']
})
export class MyEventsComponent implements OnInit {

  constructor(/*private userService: UserService, private route: ActivatedRoute,
  private eventService: EventService, private location: Location*/) { }

  ngOnInit() {
    /*this.getEvent();
    this.userService.getUser().subscribe((user) => this.currentUser = user);*/
  }

}
