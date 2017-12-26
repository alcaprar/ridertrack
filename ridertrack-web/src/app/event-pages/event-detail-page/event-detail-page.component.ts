import {Component, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../../shared/services/user.service';
import {EventService} from '../../shared/services/event.service';
import {User} from '../../shared/models/user';
import {Event} from '../../shared/models/event';
import { ActivatedRoute } from '@angular/router';
import {AuthenticationService} from '../../authentication/authentication.service';
import { Router } from "@angular/router";
import {DialogService} from "../../shared/dialog/dialog.service";
import {FacebookService, UIParams, UIResponse, InitParams} from "ngx-facebook/dist/esm/index";
import {RouteService} from "../../shared/services/route.service";

@Component({
  selector: 'app-event-detail-page',
  templateUrl: './event-detail-page.component.html',
  styleUrls: ['./event-detail-page.component.css']
})
export class EventDetailPageComponent implements OnInit {

  private eventId: String;

  private random;

  private href = '';

  private event: Event = new Event();
  private currentUser: User = new User();
  private organizer: User = new User();
  private similarEvents: Event[];
  private mapPoints: any;

  // ids of participants
  private participantsList = [];

  errors: Error[] = [];

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private eventService: EventService,
              private authService: AuthenticationService,
              private router: Router,
              private fb: FacebookService,
              private routeService: RouteService,
              private dialogService: DialogService) {
    // init Facebook strategy
    const initParams: InitParams = {
      appId: '278876872621248',
      xfbml: true,
      version: 'v2.11'
    };
    this.fb.init(initParams);

    console.log('[EventDetailPage][constructor]')
  }


  ngOnInit() {

    this.errors = [];

    this.href = window.location.href;

    this.route.params.subscribe(params => {
      this.eventId = params['eventId'];
      console.log('[EventDetail][OnInit]', this.eventId);


      this.eventService.getEvent(this.eventId)
        .then(
          (event) => {
            console.log('[EventDetail][OnInit][EventService.getEvent][success]', event);
            // TODO add a check: if the event is null redirect somewhere maybe showing an alert
            this.event = event;
            this.getRoute();

            this.eventService.getSimilarEvents(3, this.event.type)
              .then(
                (similarEvents) => {
                  console.log('[EventDetail][OnInit][EventService.getSimilarEvents][success]', similarEvents);
                  this.similarEvents = similarEvents;
                }
              )
          }
        )
        .catch(
          (error) => {
            console.log('[EventDetail][OnInit][EventService.getEvent][error]', error);
          }
        );

      this.userService.getUser()
        .subscribe(
          (user) => {
            this.currentUser = user
          });

      this.getOrganizer();

      this.getParticipants()
    });

    console.log('[Event-Detail-Component][OnInit][Event]', this.event);



    this.random = Math.random();
  }



private getRoute() {
  this.routeService.getRoute(this.eventId)
    .then(
      (coordinates) => {
        console.log('[Progress Management][OnInit][success]', coordinates);
        console.log('[Progress Management][OnInit][Coordinates detected]', coordinates);
        this.mapPoints = coordinates;
      })
    .catch((error) => {
      console.log('[Progress Management][OnInit][error]', error);
    });
}
  /**
   * It calls the event service in order to get the organizer profile.
   */
  private getOrganizer() {
    this.eventService.getOrganizer(this.eventId)
      .then(
        (organizer) => {
          console.log('[EventDetail][OnInit][EventService.getOrganizer][success]', organizer);
          this.organizer = organizer;
        }
      )
      .catch(
        (error) => {
          console.log('[EventDetail][OnInit][EventService.getOrganizer][error]', error);
        }
      )
  }

  /**
   * It calls the event service in order to get the participants list.
   */
  private getParticipants() {
    this.eventService.getParticipants(this.eventId)
      .then(
        (participants) => {
          console.log('[EventDetail][OnInit][EventService.getParticipants]', participants);
          this.participantsList = participants;
        }
      )
  }

  isLogged(): boolean {
    return this.authService.isAuthenticated()
  }

  getDate(date: Date): String {
    if (date) {
      console.log(date);
      return null;
    } else {
      return (date.getDate().toString() + '/' + (date.getMonth() + 1).toString() + '/' +
        date.getFullYear().toString());
    }
  }

  /**
   * It calls the event service to enroll the user.
   */
  enroll() {

    //if(this.enrollementIsOpen()) {
    this.dialogService.enrollement("Add Tracking Device", function() {
      this.eventService.enrollToEvent(this.eventId)
        .then(
          (response) => {
            console.log('[EventDetail][enroll][success]', response);
            // get the new list of particpants to update the buttons
            this.getParticipants();
          }
        )
        .catch(
          (error) => {
            console.log('[EventDetail][enroll][error]', error);
            this.errors = error;
          }
        )}.bind(this)
    );
   // } else {
   // this.dialogService.confirmation("Enrollement",
   //     "Sorry the registration period is CLOSED or not yet AVAILABLE",function(){
   //   });
   // }
  }

  enrollementIsOpen(): boolean {
    let today = new Date();

    if (this.event.enrollmentOpeningAt && this.event.enrollmentClosingAt) {
      console.log('[EventDetail][EnromentIsOpen]', today >= new Date(this.event.enrollmentOpeningAt));
        return today >= new Date(this.event.enrollmentOpeningAt) && today<=  new Date(this.event.enrollmentClosingAt);
    }else {
      return false;
    }
  }



  /**
   * It calls the event service to withdraw the enrollment of the user.
   */
  withdrawEnrollment() {
    console.log('[EventDetail][withdrawEnrollment]');
    this.dialogService.confirmation('Withdraw enrollment', 'Are you sure to withdraw your enrollment for this event?',
      function () {
      console.log('[EventDetail][withdrawEnrollment][callback]');
      this.eventService.withdrawEnrollment(this.eventId, this.currentUser.id)
        .then(
          (response) => {
            console.log('[EventDetail][withdrawEnrollment][success]', response);
            // get the new list of particpants to update the buttons
            this.getParticipants()
          }
        )
        .catch(
          (error) => {
            console.log('[EventDetail][withdrawEnrollment][error]', error);
              this.errors = error;
          }
        );
    }.bind(this));

  }

  /**
   * It says if the logged user, if any, is already enrolled in the events.
   * @returns {boolean}
   */
  isEnrolled() {
    return this.participantsList.includes(this.currentUser.id)
  }

  /**
   * It deletes an event when an event organizer decides to do it
   */
  deleteEvent() {
    console.log('[EventDetail][deleteEvent]');
    this.dialogService.confirmation('Delete event', 'Are you sure to delete this event?', function () {
      console.log('[EventDetail][deleteEvent][callback]');
      this.eventService.deleteEvent(this.eventId)
        .then(
          (response) => {
            console.log('[EventDetail][deleteEvent][success]', response);
            this.router.navigate(['/my-events']);
          }
        )
        .catch(
          (error) => {
            console.log('[EventDetail][deleteEvent][error]', error);
            // TODO show errors
          }
        );
    }.bind(this));
  }

  shareWithFacebook(){
    let params: UIParams = {
      href: this.href,
      method: 'share'
    };

    this.fb.ui(params)
      .then((res: UIResponse) => console.log(res))
      .catch((e: any) => console.error(e));
  }

  shareWithTumblr() {
    window.open("http://www.tumblr.com/share/link?url="+this.href,
      'mywin','left=60,top=30,height=500, width=600,toolbar=1,resizable=0');
    return false;
  }

  shareWithTwitter() {
    window.open("https://twitter.com/home?status=Look this amazing event! "+this.href,
      'mywin','left=60,top=30,height=400, width=600,toolbar=1,resizable=0');
    return false;
  }
 /** similarEvents() {
    this.eventService.getSimilarEvents(3)
      .then(
        (events) => {
          console.log('[Event Detail][getSimilarEvents][success]', events);
          this.similarEvents = events
        }
      )
      .catch(
        (error) => {
          console.log('[Event Detail][getSimilarEvents][error]', error);
        }
      );
  }**/
}


