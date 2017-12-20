///<reference path="../../shared/models/event.ts"/>
import {Component, Injectable, OnInit, ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {EventService} from "../../shared/services/event.service";
import {Event} from "../../shared/models/event";
import { DatePipe } from '@angular/common';
import {DialogService} from "../../shared/dialog/dialog.service";
declare var $: any;

@Component({
  selector: 'app-event-manage-page',
  templateUrl: './event-manage-page.component.html',
  styleUrls: ['./event-manage-page.component.css']
})
export class EventManagePageComponent implements OnInit {

  private eventTypes;

  eventId: string;
  event:Event = new Event();
  time:Date = new Date();

  private urlImage: any;
  private urlNoImage = '../../../assets/img/logofoto.png';

  errors: Error[] = [];

  constructor(private eventService: EventService, private router: Router, private route: ActivatedRoute, private dialogService: DialogService) {
  }

  ngOnInit() {
    this.eventTypes = this.eventService.getEventTypes();

    this.route.params.subscribe(params => {
      this.eventId = params['eventId'];
      console.log('[EventManage][OnInit]', this.eventId);

      // load the event using eventId
      this.eventService.getEvent(this.eventId)
        .then(
          (event) => {
            console.log('[EventManage][OnInit][getEvent][success]', event);
            this.event = event;
            this.urlImage = '/api/events/' + this.event._id + '/logo';

            // init the input of the datepicker
            $('#enrollmentOpeningAt.datepicker').datepicker("setDate" , new Date(this.event.enrollmentOpeningAt));
            $('#enrollmentClosingAt.datepicker').datepicker("setDate" , new Date(this.event.enrollmentClosingAt));
          }
        )
    })
  }

  /**
   * Once the component is rendered the init of the external dependencies are called.
   * They have to be called here otherwise they can't find the element in the DOM.
   */
  ngAfterViewInit(){
    // set the placeholder the date of today
    let todayDate = new Date();
    let today = todayDate.getDate() + '/' + (todayDate.getMonth() < 12 ? todayDate.getMonth() + 1 : 1) + '/' + todayDate.getFullYear();
    // init the plugin datepicker on the element
    $('.datepicker').datepicker({
      format: 'dd/mm/yyyy',
      todayHighlight: true,
      startDate: today,
      autoclose: true,
    });
    // init the type selectpicker
    $('.selectpicker').selectpicker();
  }

  formatDate(date){
    if(date){
      date = new Date(date);
      return date.getDate() + '/' + (date.getMonth() < 12 ? date.getMonth() + 1 : 1) + '/' + date.getFullYear()
    }else{
      return ''
    }
  }

  //save the changed date
  updateCloseDate(){
    this.event.enrollmentClosingAt = $('#enrollmentClosingAt').datepicker('getDate');
  }
  //save the changed date
  updateOpenDate(){
    this.event.enrollmentOpeningAt =  $('#enrollmentOpeningAt').datepicker('getDate');
  }
  /**
   *  When a new image is uploaded is uploaded, it reads the url and save the image
   * @param event
   */
  urlChanged(event: any) {
    if(event.target.files && event.target.files[0]) {
      let reader = new FileReader();

      reader.onload = (event: any) => {
        this.urlImage = event.target.result;
      };
        reader.readAsDataURL(event.target.files[0]);
    }
  }

  /**
   * It is called when the user clicks on the cancel button.
   * It redirects the user at my-events page.
   */
  onCancel(){
    this.router.navigate(['/my-events']);
  }


  /**
   * It is called when the user clicks on the create button.
   * It calls the method of event service waiting for a response.
   */
  onSubmit(){
    // the datepicker is not detected by angular form
    this.event.startingDate = $('#startingDate.datepicker').val();
    this.event.enrollmentOpeningAt = $('#enrollmentOpeningAt.datepicker').datepicker("getDate" );
    this.event.enrollmentClosingAt = $('#enrollmentClosingAt.datepicker').datepicker("getDate" );

    // get the logo from the input image
    this.event.logo = $('#logo').prop('files')[0];

    console.log('[EventManage][onSubmit]',$('#enrollmentOpeningAt.datepicker').datepicker("getDate" ))
    this.eventService.updateEvent(this.event._id, this.event)
      .then(
        (response) => {
          console.log('[UpdateEvent][onSubmit][success]', response);
          if(response[0] !== null){
            // errors occureed
            this.errors = response[0] as Error[];
          }else{
            var event: Event = response[1] as Event;
            this.router.navigate(['/events/', event._id]);
          }
        }
      )
      .catch(
        (error) => {
          console.log('[CreateEvent][onSubmit][error]', error);
          this.router.navigate(['/events', 'create']);
        }
      );
  }

  showErrors(errors: Error[]){
    console.log('[Login COmponent][showErrors]', errors);
    this.errors = errors;
  }

  /**
   * It is called when the user clicks on the delete button.
   * It calls the method of event service which delete the event.
   */
  deleteEvent() {
    this.dialogService.confirmation('Delete event', 'Are you sure to delete this event?', function () {
      console.log('[ManageEvent][deleteEvent]');
      this.eventService.deleteEvent(this.eventId)
        .then(
          (response) => {
            console.log('[ManageEvent][deleteEvent][success]', response);
            this.router.navigate(['/my-events']);
          }
        )
        .catch(
          (error) => {
            console.log('[ManageEvent][deleteEvent][error]', error);
            // TODO show errors
          }
        );
    }.bind(this));
  }

  /**
   * It is called when the user clicks the update route button.
   * It navigates to the route page.
   */
  editRoute() {
    this.event.startingDate = $('#startingDate.datepicker').val();
    this.event.enrollmentOpeningAt = $('#enrollmentOpeningAt.datepicker').datepicker("getDate" );
    this.event.enrollmentClosingAt = $('#enrollmentClosingAt.datepicker').datepicker("getDate" );

    // get the logo from the input image
    this.event.logo = $('#logo').prop('files')[0];

    console.log('[EventManage][onSubmit]',$('#enrollmentOpeningAt.datepicker').datepicker("getDate" ))
    this.eventService.updateEvent(this.event._id, this.event)
      .then(
        (response) => {
          console.log('[UpdateEvent][onSubmit][success]', response);
          if(response[0] !== null){
            // errors occureed
            this.errors = response[0] as Error[];
          }else{
            var event: Event = response[1] as Event;
            this.router.navigate(['/events/' + this.eventId + '/manage/route']);
          }
        }
      )
      .catch(
        (error) => {
          console.log('[CreateEvent][onSubmit][error]', error);
          this.router.navigate(['/events/' + this.eventId + '/manage/route']);
        }
      );
    console.log('[EventManage][editRoute]');
  }
}
