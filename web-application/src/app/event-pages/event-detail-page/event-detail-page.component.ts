import { Component, OnInit} from '@angular/core';
import {UserService} from '../../shared/services/user.service';
import {EventService} from '../../shared/services/event.service';
import {User} from '../../shared/models/user';
import {Event} from '../../shared/models/event';
import { ActivatedRoute } from '@angular/router';
import {AuthenticationService} from '../../authentication/authentication.service';
import { Router } from "@angular/router";
import {DialogService} from "../../shared/dialog/dialog.service";


@Component({
  selector: 'app-event-detail-page',
  templateUrl: './event-detail-page.component.html',
  styleUrls: ['./event-detail-page.component.css']
})
export class EventDetailPageComponent implements OnInit {

  private eventId: String;

  private random;

  private event: Event = new Event();
  private currentUser: User = new User();
  private organizer: User = new User();
  private similarEvents: Event[];

  // ids of participants
  private participantsList = [];

  constructor(private route: ActivatedRoute, private userService: UserService, private eventService: EventService
    , private authService: AuthenticationService, private router: Router, private dialogService: DialogService) {
  }


  ngOnInit() {
    this.route.params.subscribe(params => {
      this.eventId = params['eventId'];
      console.log('[EventDetail][OnInit]', this.eventId);


      this.eventService.getEvent(this.eventId)
        .then(
          (event) => {
            console.log('[EventDetail][OnInit][EventService.getEvent][success]', event);
            // TODO add a check: if the event is null redirect somewhere maybe showing an alert
            this.event = event;
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
    this.eventService.enrollToEvent(this.eventId)
      .then(
        (response) => {
          console.log('[EventDetail][enroll][success]', response);
          // get the new list of particpants to update the buttons
          this.getParticipants()
        }
      )
      .catch(
        (error) => {
          console.log('[EventDetail][enroll][error]', error);
          // TODO show errors
        }
      );
  }

  /**
   * It calls the event service to withdraw the enrollment of the user.
   */
  withdrawEnrollment() {
    console.log('[EventDetail][withdrawEnrollment]');
    this.dialogService.confirmation('Withdraw enrollment', 'Are you sure to withdraw your enrollment for this event?', function () {
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
            // TODO show errors
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
      console.log('[EventDetail][deleteEvent][callback]')
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


