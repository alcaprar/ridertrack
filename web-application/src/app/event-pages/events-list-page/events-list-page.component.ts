import { Component, OnInit, ApplicationRef } from '@angular/core';
import {EventService} from '../../shared/services/event.service';
import {UserService} from '../../shared/services/user.service';
import {User} from '../../shared/models/user';
import {Event} from '../../shared/models/event';
import {Router} from "@angular/router";
declare var $: any;

@Component({
  selector: 'app-events-list-page',
  templateUrl: './events-list-page.component.html',
  styleUrls: ['./events-list-page.component.css']
})
export class EventsListPageComponent implements OnInit {

  currentUser: User;
  eventsList: Event[];
  selectedEvent: Event;

  constructor(private eventService: EventService, private userService: UserService, private router: Router, private appRef: ApplicationRef) { }

  // When the component is created saves the list of all events and the current user
  ngOnInit() {
    this.eventService.getAllEvents().then(events => {
      console.log('[AllEvents][getAllEvents]',events);
     this.eventsList = events;

      
      // to force angular to update the views
      this.appRef.tick();
    });
    this.userService.getUser().subscribe(user => this.currentUser = user);
  }

  ngAfterViewInit(){
    $('#price-range').slider();
    $('#property-geo').slider();
    $('#min-baths').slider();
    $('#min-bed').slider();
    $('.selectpicker').selectpicker();
    $('input').iCheck({
      checkboxClass: 'icheckbox_square-yellow',
      radioClass: 'iradio_square-yellow',
      increaseArea: '20%' // optional
    });
    $('.layout-grid').on('click', function () {
      $('.layout-grid').addClass('active');
      $('.layout-list').removeClass('active');

      $('#list-type').removeClass('proerty-th-list');
      $('#list-type').addClass('proerty-th');

    });

    $('.layout-list').on('click', function () {
      $('.layout-grid').removeClass('active');
      $('.layout-list').addClass('active');

      $('#list-type').addClass('proerty-th-list');
      $('#list-type').removeClass('proerty-th');

    });
  }

}
