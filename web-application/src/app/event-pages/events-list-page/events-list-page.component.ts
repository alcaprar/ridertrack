import { Component, OnInit, ApplicationRef } from '@angular/core';
import {EventService} from '../../shared/services/event.service';
import {UserService} from '../../shared/services/user.service';
import {User} from '../../shared/models/user';
import {Event} from '../../shared/models/event';
import {Router, ActivatedRoute} from "@angular/router";
import {EventsListQueryParams} from "../../shared/models/eventsListQueryParams";
declare var $: any;

@Component({
  selector: 'app-events-list-page',
  templateUrl: './events-list-page.component.html',
  styleUrls: ['./events-list-page.component.css']
})
export class EventsListPageComponent implements OnInit {

  currentUser: User;
  eventsList: Event[] = [];
  private eventTypes: String[];
  selectedEvent: Event;

  private queryParams: EventsListQueryParams = new EventsListQueryParams;
  totalPages = 0;

  constructor(private eventService: EventService, private route: ActivatedRoute, private userService: UserService, private router: Router, private appRef: ApplicationRef) {
    // retrieve the event types
    this.eventTypes = this.eventService.getEventTypes();
  }

  // When the component is created saves the list of all events and the current user
  ngOnInit() {
    this.eventService.getAllEvents().then(events => {
      console.log('[AllEvents][getAllEvents]',events);
     this.eventsList = events;


      // to force angular to update the views
      this.appRef.tick();
    });
    this.userService.getUser().subscribe(user => this.currentUser = user);

    // get query params for pagination
    this.route.queryParams
      .subscribe(
        params=> {

          this.queryParams.page = +params['page'] || 0; // the plus before params is used to cast it to a number
          this.queryParams.itemsPerPage = +params['itemsPerPage'] || 12;
          this.queryParams.keyword = params['keyword'] || '';
          this.queryParams.sort = params['sort'] || '';
          this.queryParams.type = params['type'] || '';
          this.queryParams.length = +params['length'] || 0;
          this.queryParams.city = params['city'] || '';

          console.log('[EventList][ngOnInit]', this.queryParams)
        }
      )
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
