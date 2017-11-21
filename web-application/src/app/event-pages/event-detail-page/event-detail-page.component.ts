import { Component, OnInit } from '@angular/core';
import {UserService} from '../../shared/services/user.service';
import {Location} from '@angular/common';
import {EventService} from '../../shared/services/event.service';
import {User} from '../../shared/models/user';
import {Event} from '../../shared/models/event';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-event-detail-page',
  templateUrl: './event-detail-page.component.html',
  styleUrls: ['./event-detail-page.component.css']
})
export class EventDetailPageComponent implements OnInit {

  private eventId: String;

  //just an example then information would be take from server
  currentEvent: Event = {id: 1 , _organizerID : 2, name: 'New York Marathon',
  type: 'Marathon', description: 'lorem inpsum ahddhjkhekehfkjhewkjhfkh dkhefhjkfhjewhfhfhfkjh' +
    'jhebwhjfjbfewhjgfw jfgejhfgejhfgjhfjgwfwhvhje ejejndndn', city: 'New York', country: 'USA',
  maxDuration: 120, startingTime: new Date('10 january, 2018 10:30:00'), enrollmentOpeningAt:  new Date('10 december, 2017 10:30:00'),
  enrollmentClosingAt:  new Date('30 december, 2018 10:30:00'), participantsList: null,
    routes: [[40.661390, -73.979641],[40.675814, -73.971487],[40.670806, -73.957754]],
    logo: 'https://assets.bwbx.io/images/users/iqjWHBFdfxIU/i54IjlJe6So0/v1/-1x-1.jpg', length: 30};

  currentUser: User;
  organizer: User = new User('john@mail.com','John','Smith','password');

  enrollementOpenDate: String;
  enrollementCloseDate: String;
  fullStartingTime: String;
  startingTime:String;
  today: Date = new Date();
  enrollement: String;

  constructor(/*private route: ActivatedRoute private userService: UserService, private route: ActivatedRoute,
              private eventService: EventService, private location: Location*/) {
  }

  // When the component is created catch the current event object and the current user
  ngOnInit() {

    /*
    this.route.params.subscribe(params => {
      this.eventId = params['eventId'];
      console.log('[EventDetail][OnInit]', this.eventId);

      // load the event using eventId
      // load the currentUser
      // load the organizer

    });*/
    // this.userService.getUser().subscribe((user) => this.currentUser = user);*/
    this.enrollementOpenDate = this.getFullDate(this.currentEvent.enrollmentOpeningAt);
    this.enrollementCloseDate = this.getFullDate(this.currentEvent.enrollmentClosingAt);
    this.startingTime = this.getDate(this.currentEvent.startingTime);
    this.fullStartingTime = this.getFullDate(this.currentEvent.startingTime);
    this.isEnrollementAvailable();
    console.log('[Event-Detail-Component][OnInit][Event]', this.currentEvent);
  }

  /**
   *  Get the event from the server calling the associated method in the EventService
   *  and stores it in the 'currentEvent' variable.
   *  id: it is taken from the url of the route /event/:id

  getEvent() :void {
    const id= +this.route.snapshot.paramMap.get('id');
    this.eventService.getEvent(id).then((event) => this.currentEvent = event);
    console.log('[EventDetailComponent][getEvent][success]', this.currentEvent);
  }*/

 getFullDate(date: Date): String {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hour = date.getHours();
    const minutes = date.getMinutes();
    return (day.toString()+ '/' + month.toString()+ '/'+
      year.toString()+ ' at ' + hour.toString() +':' + minutes.toString());
  }

  getDate(date: Date): String {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return (day.toString()+ '/' + month.toString()+ '/'+
      year.toString());
  }

  isEnrollementAvailable(): Boolean {
   if(this.today.getTime() <= this.currentEvent.enrollmentClosingAt.getTime()
    && this.today.getTime() >= this.currentEvent.enrollmentOpeningAt.getTime()){
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


