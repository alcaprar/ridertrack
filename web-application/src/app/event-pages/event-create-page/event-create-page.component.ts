import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {EventService} from "../../shared/services/event.service";
import {EventToCreate} from "../../shared/models/eventToCreate";
declare var $: any;

@Component({
  selector: 'app-event-create-page',
  templateUrl: './event-create-page.component.html',
  styleUrls: ['./event-create-page.component.css']
})
export class EventCreatePageComponent implements OnInit {

  private eventTypes;

  event = new EventToCreate();

  constructor(private eventService: EventService, private router: Router) {
  }

  ngOnInit() {
    this.eventTypes = this.eventService.getEventTypes()
  }

  /**
   * Once the component is rendered the init of the external dependencies are called.
   * They have to be called here otherwise they can't find the element in the DOM.
   */
  ngAfterViewInit(){
    // set the placeholder the date of today
    var todayDate = new Date();
    var today = todayDate.getDate() + '/' + (todayDate.getMonth() < 12 ? todayDate.getMonth() + 1 : 1) + '/' + todayDate.getFullYear();
    $('#startingDate.datepicker').attr('placeholder', today);
    // init the plugin datepicker on the element
    $('#startingDate.datepicker').datepicker({
      format: 'dd/mm/yyyy',
      todayHighlight: true,
      startDate: today,
      autoclose: true,
    });
    // init the type selectpicker
    $('.selectpicker').selectpicker();

    function formatDate(date){
      return date.getDate() + '/' + (date.getMonth() < 12 ? date.getMonth() + 1 : 1) + '/' + date.getFullYear()
    }
  }

  /**
   * It is called when the user clicks on the cancel button.
   * It redirects the user at my-events page.
   */
  onCancel(){
    this.router.navigate(['my-events']);
  }

  /**
   * It is called when the user clicks on the create button.
   * It calls the method of event service waiting for a response.
   */
  onSubmit(){
    // the datepicker is not detected by angular form
    this.event.startingDate = $('#startingDate.datepicker').val();
    this.event.logo = $('#logo').prop('files')[0];
    console.log('Submitted', this.event);

    this.eventService.createEvent(this.event)
      .then(
        (response) => {
          console.log('[CreateEvent][onSubmit][success]', response);
          var eventId = response._id;
          this.router.navigate(['/manage-event/' + eventId]);
        }
      )
      .catch(
        (error) => {
          console.log('[CreateEvent][onSubmit][error]', error);
          // TODO show errors
        }
      )
  }
}
