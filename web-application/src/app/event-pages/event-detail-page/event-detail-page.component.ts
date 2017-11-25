import { Component, OnInit} from '@angular/core';
import {UserService} from '../../shared/services/user.service';
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
  private alreadyEnrolled: boolean;

  private event: Event = new Event();
  private currentUser: User = new User();
  private organizer: User = new User();

  private enrolledEvents: any;
  private enrollements = [];
  private eventLogo: any;

  constructor(private route: ActivatedRoute, private userService: UserService, private eventService: EventService
    , private authService: AuthenticationService) {
  }


  ngOnInit() {
    // catch the event id
    // this.getEnrolledEvents;
    this.getEnrolledEvents(this.authService.getUserId());
    console.log(this.userService.getUser);
    this.route.params.subscribe(params => {
      this.eventId = params['eventId'];
      console.log('[EventDetail][OnInit]', this.eventId);


      this.eventService.getEvent(this.eventId)
        .then(
          (event) =>{
            console.log('[EventDetail][OnInit][EventService.getEvent][success]', event);
            // TODO add a check: if the event is null redirect somewhere maybe showing an alert
            this.event = event ;
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

    console.log('[Event-Detail-Component][OnInit][Event]', this.event);
  }



  getDate(date: Date): String {
    if(date) {
      console.log(date);
      return null;
    } else {
      return (date.getDate().toString() + '/' + (date.getMonth()+1).toString() + '/' +
        date.getFullYear().toString());
    }
  }

  enroll(){
    console.log(this.eventService.enrollToEvent(this.eventId));
    this.alreadyEnrolled = true;
  }

  withdrawEnrollment(){
    console.log(this.eventService.withdrawEnrollment(this.eventId, this.currentUser.id));
    this.alreadyEnrolled = false;
  }


  getEnrolledEvents(id){
    this.eventService.getEnrolledEventsForUser(id).then(
      (events) =>{
        console.log('[EventDetail][OnInit][getEnrolledEventsForUser][success]', events);
        this.enrolledEvents = events;
        for(let event of this.enrolledEvents){
          this.enrollements.push(event._id);
        }
        console.log('[EventDetail][Enrolled events id]: '+ this.enrollements);
        this.isAlreadyEnrolled();
      }
    )
    .catch(
      (error) =>{
        console.log('[EventDetail][OnInit][getEnrolledEventsForUser][error]', error);
      }
    )
  }

  isAlreadyEnrolled() {
    if(this.enrollements.includes(this.eventId)) {
      this.alreadyEnrolled = true;
    }
    else {
      this.alreadyEnrolled = false;
    }
  }



}


