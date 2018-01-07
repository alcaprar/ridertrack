import { Component, OnInit, ApplicationRef, ViewChild, ElementRef } from '@angular/core';
import {AuthenticationService} from "../../../authentication/authentication.service";
import {EventService} from "../../../shared/services/event.service";
import {MyEventsQueryParams} from "../../../shared/models/myEventsQueryParams";
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-enrolled-events',
  templateUrl: './enrolled-events.component.html',
  styleUrls: ['./enrolled-events.component.css']
})
export class EnrolledEventsComponent implements OnInit {

  @ViewChild('itemsPerPage') itemsPerPageSelect: ElementRef;

  public allowedItemsPerPage = [3, 6, 9, 12, 15];

  public queryParams: MyEventsQueryParams = new MyEventsQueryParams();
  public totalPages: number = 0;

  public enrolledEvents: Event[] = [];

  public loading = true;

  constructor(private authService: AuthenticationService, private eventService: EventService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.queryParams
      .subscribe(
        params=> {

          this.queryParams.page = +params['page'] || 1; // the plus before params is used to cast it to a number
          this.queryParams.itemsPerPage = (this.allowedItemsPerPage.indexOf(+params['itemsPerPage']) > -1) ? +params['itemsPerPage'] : 12;

          console.log('[MyEvents][ngOnInit]', this.queryParams);

          // get events
          this.getEnrolledEvents();
        }
      );
  }

  getEnrolledEvents(){
    this.loading = true;
    this.eventService.getEnrolledEventsForUser(this.authService.getUserId(), this.queryParams).then(
      (response) =>{
        this.loading = false;
        console.log('[My-Events][OnInit][getEnrolledEventsForUser][success]', response);
        this.enrolledEvents = response[0] as Event[];
        this.queryParams.page = response[1];
        this.queryParams.itemsPerPage = response[2];
        this.totalPages = response[3];
      }
    )
      .catch(
        (error) =>{
          this.loading = false;
          console.log('[My-Events][OnInit][getEnrolledEventsForUser][error]', error);
        }
      )
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

  private updateEventsList(){
    this.router.navigate([ '/my-events', 'enrolled' ], {
      queryParams: this.queryParams
    });
  }

}
