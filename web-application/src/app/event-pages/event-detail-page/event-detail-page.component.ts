import { Component, OnInit } from '@angular/core';
import {UserService} from '../../shared/services/user.service';
import {Location} from '@angular/common';
import {EventService} from '../../shared/services/event.service';
import {User} from '../../shared/models/user';
import {Event} from '../../shared/models/event';
import { ActivatedRoute } from '@angular/router';
import {AuthenticationService} from '../../authentication/authentication.service';

@Component({
  selector: 'app-event-detail-page',
  templateUrl: './event-detail-page.component.html',
  styleUrls: ['./event-detail-page.component.css']
})
export class EventDetailPageComponent implements OnInit {

  private eventId: String;

  private event: Event = new Event();
  private currentUser: User = new User();
  private organizer: User = new User();

  private enrollement: String;
  private enrollementOpenDate: String;
  private enrollementCloseDate: String;
  private eventLogo: any;

  constructor(private route: ActivatedRoute, private userService: UserService, private eventService: EventService
    , private authService: AuthenticationService) {
  }


  ngOnInit() {
    // catch the event id
    console.log(this.userService.getUser);
    this.route.params.subscribe(params => {
      this.eventId = params['eventId'];
      console.log('[EventDetail][OnInit]', this.eventId);

      this.eventService.getEvent(this.eventId)
        .then(
          (event) =>{
            console.log('[EventDetail][OnInit][EventService.getEvent][success]', event);
            // TODO add a check: if the event is null redirect somewhere maybe showing an alert
            this.event = event;
          }
        )
        .catch(
          (error) =>{
            console.log('[EventDetail][OnInit][EventService.getEvent][error]', error);
          }
        );

      this.userService.getUser()
        .subscribe(
          (user) => {
            this.currentUser = user
          });

      this.eventService.getOrganizer(this.eventId)
        .then(
          (organizer) =>{
            console.log('[EventDetail][OnInit][EventService.getOrganizer][success]', organizer);
            this.organizer = organizer;
          }
        )
        .catch(
          (error) =>{
            console.log('[EventDetail][OnInit][EventService.getOrganizer][error]', error);
          }
        )
    });

    this.enrollementOpenDate = this.getDate(this.event.enrollmentOpeningAt);
    this.enrollementCloseDate = this.getDate(this.event.enrollmentClosingAt);
    this.isEnrollementAvailable();
    console.log('[Event-Detail-Component][OnInit][Event]', this.event);
  }



  getDate(date: Date): String {
    if(date == null) return null;
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return (day.toString()+ '/' + month.toString()+ '/'+
      year.toString());
  }

  enroll(){
    console.log(this.eventService.enrollToEvent(this.eventId));
  }

  isEnrollementAvailable(): Boolean {
    var today= new Date();
   if(today.getTime() <= this.event.enrollmentClosingAt.getTime()
    && today.getTime() >= this.event.enrollmentOpeningAt.getTime()){
     this.enrollement = "Open";
     return true;
   }else {
     this.enrollement = "Close";
     return false;
   }
  }


  /**
   *  function that allow to go back at the previous browser page

  goBack(){
    this.location.back();
  }*/

}


