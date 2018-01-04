import {Component, OnInit, ApplicationRef, ViewChild, ElementRef, ViewEncapsulation} from '@angular/core';
import {EventService} from '../../shared/services/event.service';
import {UserService} from '../../shared/services/user.service';
import {User} from '../../shared/models/user';
import {Event} from '../../shared/models/event';
import {Router, ActivatedRoute} from "@angular/router";
import {EventsListQueryParams} from "../../shared/models/eventsListQueryParams";
declare var $: any;

@Component({
  selector: 'app-events-list-page',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './events-list-page.component.html',
  styleUrls: ['./events-list-page.component.css']
})
export class EventsListPageComponent implements OnInit {

  @ViewChild('searchKeyword') searchKeyword: ElementRef;
  @ViewChild('searchType') searchType: ElementRef;
  @ViewChild('itemsPerPage') itemsPerPageSelect: ElementRef;

  private currentUser: User;
  private eventsList: Event[] = [];
  private eventTypes: String[];
  private maxLengthSlider = 300;
  private minLengthSlider = 0;
  private allowedItemsPerPage = [3, 6, 9, 12, 15];

  public userSettingCity: any = {
    showSearchButton: false,
    geoTypes: ['(cities)'],
    showCurrentLocation: false,
    inputPlaceholderText: 'City'

  };

  private queryParams: EventsListQueryParams = new EventsListQueryParams;
  private totalPages: number = 0;

  private loading = true;

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
          this.queryParams.lengthgte = (!isNaN(params['lengthgte'])) ? params['lengthgte'] : undefined;
          this.queryParams.lengthlte = (!isNaN(params['lengthlte'])) ? params['lengthlte'] : undefined;
          this.queryParams.city = params['city'] || undefined;
          this.queryParams.country = params['country'] || undefined;

          console.log('[EventList][ngOnInit]', this.queryParams);

          // get events
          this.loading = true;
          this.eventService.getAllEvents(this.queryParams)
            .then(
              (response) => {
                this.loading = false;
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
    $('#length-range').slider({
      value: [
        (this.queryParams.lengthgte >= 0 && this.queryParams.lengthgte <=300 ? this.queryParams.lengthgte : 0),
        (this.queryParams.lengthlte >= 0 && this.queryParams.lengthlte <=300 ? this.queryParams.lengthlte : 300)
      ]
    });

    console.log('slider', [
      (this.queryParams.lengthgte >= 0 && this.queryParams.lengthgte <=300 ? this.queryParams.lengthgte : 0),
      (this.queryParams.lengthlte >= 0 && this.queryParams.lengthlte <=300 ? this.queryParams.lengthlte : 300)
    ])
    $('.selectpicker').selectpicker();
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
    this.queryParams.type = (this.searchType.nativeElement.value == -1) ? undefined : this.searchType.nativeElement.value;

    // length search
    console.log('[EventsList][search]', $('#length-range').val(), 'a');
    var length1 = parseInt($('#length-range').val().split(',')[0]);
    var length2 = parseInt($('#length-range').val().split(',')[1]);

    if(isNaN(length1) || isNaN(length2) || (length1 == 0 && length2 == 300)){
      this.queryParams.lengthgte = undefined;
      this.queryParams.lengthlte = undefined;
    }else{
      this.queryParams.lengthgte = length1;
      this.queryParams.lengthlte = length2;
    }

    this.queryParams.sort = undefined;
    this.queryParams.page = undefined;
    this.queryParams.itemsPerPage = undefined;

    console.log('[EventsList][search]', this.queryParams);

    this.updateEventsList();
  }

  autocompleteCity(selectedData: any){
    if(selectedData.data){
      console.log('[EventsList][autoCompleteCity]', selectedData.data.address_components);
      for(let i=0; i < selectedData.data.address_components.length; i++){
        if(['administrative_area_level_3', 'locality'].indexOf(selectedData.data.address_components[i].types[0]) > -1) {
          this.queryParams.city = selectedData.data.address_components[i].long_name;
          console.log("[EventsList][autoCompleteCity][City]" + this.queryParams.city);
        }
      }
    }else{
      this.queryParams.city = undefined;
    }
  }

  /**
   * It navigate to the route with the new query params.
   */
  private updateEventsList(){

  this.router.navigate([ '/events' ], {
    queryParams: this.queryParams
  });
}

}
