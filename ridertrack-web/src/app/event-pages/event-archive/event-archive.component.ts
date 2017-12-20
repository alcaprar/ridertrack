import { Component, OnInit, ApplicationRef, ViewChild, ElementRef } from '@angular/core';
import {EventService} from '../../shared/services/event.service';
import {UserService} from '../../shared/services/user.service';
import {User} from '../../shared/models/user';
import {Event} from '../../shared/models/event';
import {Router, ActivatedRoute} from "@angular/router";
import {EventsListQueryParams} from "../../shared/models/eventsListQueryParams";
declare var $: any;

@Component({
  selector: 'app-event-archive',
  templateUrl: './event-archive.component.html',
  styleUrls: ['./event-archive.component.css']
})
export class EventArchiveComponent implements OnInit {

    @ViewChild('searchKeyword') searchKeyword: ElementRef;
    @ViewChild('searchCity') searchCity: ElementRef;
    @ViewChild('searchType') searchType: ElementRef;
    @ViewChild('itemsPerPage') itemsPerPageSelect: ElementRef;

    private currentUser: User;
    private eventsList: Event[] = [];
    private eventTypes: String[];
    private allowedItemsPerPage = [3, 6, 9, 12, 15];

    private queryParams: EventsListQueryParams = new EventsListQueryParams;
    private totalPages: number = 0;

    constructor(private eventService: EventService, private route: ActivatedRoute, private userService: UserService, private router: Router, private appRef: ApplicationRef) {
      // retrieve the event types
      this.eventTypes = this.eventService.getEventTypes();
    }

    // When the component is created saves the list of all events and the current user
    ngOnInit() {
      this.userService.getUser()
        .subscribe(
          user => {
            this.currentUser = user
          });

      // get query params for pagination
      this.route.queryParams
        .subscribe(
          params=> {

            this.queryParams.page = +params['page'] || 1; // the plus before params is used to cast it to a number
            this.queryParams.itemsPerPage = (this.allowedItemsPerPage.indexOf(+params['itemsPerPage']) > -1) ? +params['itemsPerPage'] : 12;
            this.queryParams.keyword = params['keyword'] || undefined;
            this.queryParams.sort = params['sort'] || undefined;
            this.queryParams.type = params['type'] || undefined;
            this.queryParams.lengthgte = params['lengthgte'] || undefined;
            this.queryParams.lengthlte = params['lengthlte'] || undefined;
            this.queryParams.city = params['city'] || undefined;
            this.queryParams.country = params['country'] || undefined;

            console.log('[EventList][ngOnInit]', this.queryParams);

            // get events
            this.eventService.getAllPassedEvents(this.queryParams)
              .then(
                (response) => {
                  console.log('[AllEvents][getAllEvents]', response);
                  this.eventsList = response[0];
                  this.queryParams.page = response[1];
                  this.queryParams.itemsPerPage = response[2];
                  this.totalPages = response[3];
                });
          }
        )
    }

    ngAfterViewInit(){
      $('#price-range').slider();
      $('#length-range').slider();
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

    /**
     * It is called when the user clicks on the prev page.
     */
    prevPage(){
      if(this.queryParams.page > 1){
        this.queryParams.page--;
        this.updateEventsList()
      }
    }

    /**
     * It is called when the user clicks on the next page.
     */
    nextPage(){
      if(this.queryParams.page < this.totalPages){
        this.queryParams.page++;
        this.updateEventsList();
      }
    }

    changePage(page){
      this.queryParams.page = page;
      this.updateEventsList()
    }

    /**
     * Triggered when the dropdown chages the selection.
     */
    onItemsPerPageChanged(){
      console.log('[EventsList][onItemsPerPageChanged]', this.itemsPerPageSelect.nativeElement.value);
      this.queryParams.itemsPerPage = this.itemsPerPageSelect.nativeElement.value;
      this.queryParams.page = 1
      this.updateEventsList()
    }

    /**
     * It is called when the search button is clicked.
     */
    search(){
      this.queryParams.keyword = (this.searchKeyword.nativeElement.value === '') ? undefined : this.searchKeyword.nativeElement.value;
      this.queryParams.city = (this.searchCity.nativeElement.value === '') ? undefined : this.searchCity.nativeElement.value;
      this.queryParams.type = (this.searchType.nativeElement.value == -1) ? undefined : this.searchType.nativeElement.value;

      this.queryParams.sort = undefined;
      this.queryParams.page = undefined;
      this.queryParams.itemsPerPage = undefined;

      console.log('[EventsList][search]', this.queryParams);

      this.updateEventsList();
    }

    /**
     * It navigate to the route with the new query params.
     */
    private updateEventsList(){
    this.queryParams.lengthgte = undefined; // TODO remove when length slider is activated
    this.queryParams.lengthlte = undefined; // TODO remove when length slider is activated

    this.router.navigate([ '/archive' ], {
      queryParams: this.queryParams
    });
  }

  }
