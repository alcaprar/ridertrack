import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UserService} from '../../shared/services/user.service';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {EventService} from '../../shared/services/event.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {User} from '../../shared/models/user';
import {Event} from '../../shared/models/event';
declare var $: any;


@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MyEventsComponent implements OnInit {

  enrolledEvents: Event[] = [];
  organizedEvents: Event[] = [];

  constructor(private userService: UserService, private route: ActivatedRoute,
     private eventService: EventService, private authService: AuthenticationService) {
  }

  ngOnInit() {
    $('.tabs__tab.active[_ngcontent-c6]').each(function () {
      this.style.setProperty( 'background-color', '#FDC600', 'important' );
    });
    this.getOrganizedEvents(this.authService.getUserId());
    this.getEnrolledEvents(this.authService.getUserId());
  }

  getOrganizedEvents(id){
    this.eventService.getOrganizedEventsForUser(id).then(
      (events) =>{
        console.log('[My-Events][OnInit][getOrganizedEventsForUser][success]', events);
        this.organizedEvents = events
      }
    )
    .catch(
      (error) =>{
        console.log('[My-Events][OnInit][getOrganizedEventsForUser][error]', error);
      }
    )
  }

  getEnrolledEvents(id){
    this.eventService.getEnrolledEventsForUser(id).then(
      (events) =>{
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
