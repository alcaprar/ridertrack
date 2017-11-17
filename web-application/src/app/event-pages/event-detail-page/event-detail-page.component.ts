import { Component, OnInit } from '@angular/core';
import {UserService} from '../../shared/services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {EventService} from '../../shared/services/event.service';
import {User} from '../../shared/models/user';
import {Event} from '../../shared/models/event';

@Component({
  selector: 'app-event-detail-page',
  templateUrl: './event-detail-page.component.html',
  styleUrls: ['./event-detail-page.component.css']
})
export class EventDetailPageComponent implements OnInit {

  public currentEvent: Event = {
    id: 1, name: 'London Marathon', _organizerID: 2, type: 'Marathon', description: 'Nulla quis dapibus nisl. ' +
    'Suspendisse ultricies Nulla quis dapibus nisl. Suspendisse ultricies commodo arcu nec\n' +  'pretium. Nullam sed arcu ultricies ' +
    'commodo arcu nec pretium. Nullam sed arcu ultricies Nulla quis dapibus nisl.\n',
    country: 'UK', city: 'London', startingTime: new Date('December 10, 2018 10:00:00'), maxDuration: 120,
    participantsList: null, enrollmentOpeningAt: new Date('November 10, 2018 10:00:00'),
    enrollmentClosingAt: new Date('December 5, 2018 10:00:00'),
    logo: 'http://bsnscb.com/data/out/122/39407432-marathon-wallpapers.jpg', routes: null
  };
  currentUser: User = new User('ciao@mail.it', 'John', 'Sarry', 'password' );
  enrollement: String;
  organizer: User  = new User('ciao@mail.it', 'John', 'Smith', 'password' );

  constructor(private userService: UserService, private route: ActivatedRoute, private eventService: EventService) {
  }

  // When the component is created catch the current event object and the current user
  ngOnInit() {
    // after integration
    /*this.eventService.getEvent(this.route.snapshot.params['id']).then((event) => this.currentEvent = event);
    this.userService.getUser().subscribe((user) => this.currentUser = user);*/
    this.isEnrollementOpen();
  }

  /**
   *  Check if the period of enrollement is open or close returning true is it is open
   *  or false if it is close
   * @returns {Boolean}
   */
  isEnrollementOpen(): Boolean {
    const today = Date.now(); // return the milliseconds from january 1970 to today

    const millisecondsOpenDate = this.currentEvent.enrollmentOpeningAt.valueOf();
    const millisecondsCloseDate = this.currentEvent.enrollmentClosingAt.valueOf();

    if (today >= millisecondsOpenDate && today <= millisecondsCloseDate){
    this.enrollement = 'Open';
    console.log('[component][result true][enrollement]', this.enrollement );
    return true;
    }else {
      this.enrollement = 'Close';
      console.log('[component][result false][enrollement]', this.enrollement );
      return false;
    }
  }

  }

