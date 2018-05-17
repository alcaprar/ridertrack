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
import {SortService} from "../event-progress/sort.service";

@Component({
  selector: 'app-event-detail-page',
  templateUrl: './event-detail-page.component.html',
  styleUrls: ['./event-detail-page.component.css']
})
export class EventDetailPageComponent implements OnInit {

  public eventId: String;

  public logoUrl = '';

  public logoOrganizer;

  public href = '';

  public event: Event = new Event();
  public currentUser: User = new User();
  public organizer: User = new User();
  public similarEvents: Event[];
  public mapPoints: any;
  private ranking: any = [];

  // ids of participants
  public participantsList = [];

  public errors: Error[] = [];

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private eventService: EventService,
              private authService: AuthenticationService,
              private router: Router,
              private fb: FacebookService,
              private routeService: RouteService,
              private dialogService: DialogService,
              private sortService: SortService) {
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

      this.updateLogoUrl();

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
                });
            if (this.event.status === 'passed') {
              this.getRanking();
            }
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
  }

  /**
   * get the final ranking of the event that has passed
   */
  getRanking() {
    this.eventService.getRanking(this.eventId).then((users)=> {
      for (let i = 0; i < users.length; i++) {
        this.ranking.push({position: i + 1, name: users[i].name, surname: users[i].surname});
      }
      console.log("[EventDetailPage][getFinalRanking]", this.ranking);
      this.sortService.sortTable({sortColumn: 'position', sortDirection: 'asc'}, this.ranking);
    });
  }

  /**
   *  used to sort the ranking table when an event is passed
   * @param $event : column name and order to sort
   */
  onSorted($event){
    this.sortService.sortTable($event, this.ranking);
  }

  /**
   * It changes the query string of the logo request in order to avoid browser caching.
   */
  private updateLogoUrl(){
    this.logoUrl = "/api/events/" + this.eventId + "/logo?random=" + this.randomInt(1, 1000);
  }

  private updateLogoOrganizer(id) {
    this.logoOrganizer = "/api/users/" + id + "/logo?random=" + this.randomInt(1, 1000);
  }

  /**
   * It retrieves the route of the event calling the routeService.
   * It stores the coordinates in a variable in order to render it.
   */
  private getRoute() {
    this.routeService.getRoute(this.eventId)
      .then(
        (route) => {
          console.log('[EventDetailPage][getRoute][success]', route);
          this.mapPoints = route.coordinates;
        })
      .catch((err) => {
        console.log('[EventDetailPage][getRoute][error]', err);
      });
  }

  /**
   * It calls the event service in order to get the organizer profile.
   */
  private getOrganizer() {
    this.eventService.getOrganizer(this.eventId)
      .then(
        (organizer) => {
          console.log('[EventDetail][getOrganizer][success]', organizer);
          this.organizer = organizer;
          if(this.organizer.logo !== undefined) {
            this.updateLogoOrganizer(this.organizer._id);
          }
        }
      )
      .catch(
        (error) => {
          console.log('[EventDetail][getOrganizer][error]', error);
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
          console.log('[EventDetail][getParticipants]', participants);
          this.participantsList = participants;
        }
      )
  }

  /**
   * It returns true if the user is logged, false otherwise.
   * Used for showing buttons to guest and user accordingly.
   * @returns {boolean}
     */
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
   * It opens the dialog for enrolling.
   */
  enroll() {
    this.dialogService.enrollement("Add Tracking Device", this.eventId, false, function() {
        this.getParticipants();
    }.bind(this));
  }

  enrollementIsOpen(): boolean {
    let today = new Date();

    if (this.event.enrollmentOpeningDate && this.event.enrollmentClosingDate) {
      console.log('[EventDetail][EnromentIsOpen]', today >= new Date(this.event.enrollmentOpeningDate));
      return today >= new Date(this.event.enrollmentOpeningDate) && today<=  new Date(this.event.enrollmentClosingDate);
    }else {
      return false;
    }
  }



  /**
   * It calls the event service to withdraw the enrollment of the user.
   */
  manageEnrollment() {
    console.log('[EventDetail][ManageEnrollment]');
    this.dialogService.enrollement("Manage Enrollement", this.eventId, true, function(){}.bind(this));
    this.getParticipants();
  }


  /**
   * It says if the logged user, if any, is already enrolled in the events.
   * @returns {boolean}
   */
  isEnrolled() {
    for(let i = 0; i < this.participantsList.length; i++){
      if(this.participantsList[i].userId._id === this.currentUser.id){
        return true;
      }
    }

    return false;
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
          () => {
            console.log('[EventDetail][deleteEvent][success]');
            this.router.navigate(['/my-events']);
          }
        )
        .catch(
          (error) => {
            console.log('[EventDetail][deleteEvent][error]', error);
            this.errors = error;
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

  /**
   * It returns a random int calculated between the 2 limits.
   * @param min
   * @param max
   * @returns {any}
   */
  randomInt(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
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


