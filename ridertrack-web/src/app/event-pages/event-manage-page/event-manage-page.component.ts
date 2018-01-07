///<reference path="../../shared/models/event.ts"/>
import {Component, Injectable, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {EventService} from "../../shared/services/event.service";
import {Event} from "../../shared/models/event";
import { DatePipe } from '@angular/common';
import {DialogService} from "../../shared/dialog/dialog.service";
declare var $: any;

@Component({
  selector: 'app-event-manage-page',
  encapsulation: ViewEncapsulation.None,
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
  public userSettingCity: any;

  constructor(private eventService: EventService, private router: Router, private route: ActivatedRoute,
              private dialogService: DialogService) {
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
            this.userSettingCity = {
              showSearchButton: false,
              geoTypes: ['(cities)'],
              showCurrentLocation: false,
              inputPlaceholderText: this.event.city + ', '+ this.event.country
            };
          }
        )
    })
  }

  /**
   * Once the component is rendered the init of the external dependencies are called.
   * They have to be called here otherwise they can't find the element in the DOM.
   */
  ngAfterViewInit(){
    // init the plugin datepicker on the element
    $('.datepicker').datepicker({
      format: 'dd/mm/yyyy',
      todayHighlight: true,
      autoclose: true,
    });
    // init the type selectpicker
    $('.selectpicker').selectpicker();
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


  autocompleteCity(selectedData: any){
    for(let i=0; i< selectedData.data.address_components.length; i++){
      if(['locality', 'administrative_area_level_3'].indexOf(selectedData.data.address_components[i].types[0]) > -1) {
        this.event.city = selectedData.data.address_components[i].long_name;
        console.log("[Updated][City]" + this.event.city);
      }
      if (selectedData.data.address_components[i].types[0]=== 'country'
        && selectedData.data.address_components[i].types[1]==='political'){
        this.event.country = selectedData.data.address_components[i].long_name;
        console.log ("[Updated][Country]"+ this.event.country);
      }
    }
  }

  /**
   * It is called when the user clicks on the create button.
   * It calls the method of event service waiting for a response.
   */
  onSubmit(){
    if(this.isFormValid()){
      // get the logo from the input image
      this.event.logo = $('#logo').prop('files')[0];

      console.log('[EventManage][onSubmit]', this.event);
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
  }

  /**
   * It checks all the field in the form.
   * It returns true or false.
   * If there are any errors, it also shows them.
   */
  isFormValid(){
    var validTimeRegex = /(00|01|02|03|04|05|06|07|08|09|10|11|12|13|14|15|16|17|18|19|20|21|22|23)[:](0|1|2|3|4|5)\d{1}/;
    this.errors = [];

    if(!this.event.name){
      //if name is missing show an error
      var error = new Error('Name is missing.');
      this.errors.push(error);
    }
    if(!this.event.type){
      // if type is missing show an error
      var error = new Error('Type is missing.');
      this.errors.push(error);
    }
    this.event.startingDateString = $('#startingDate').val();
    if(!this.event.startingDateString){
      // if startingDate is missing show an error
      var error = new Error('Starting date is missing.');
      this.errors.push(error);
    }
    this.event.startingTimeString = $('#startingTime').val();
    if(!this.event.startingTimeString){
      // if startingTime is missing show an error
      var error = new Error('Starting time is missing.');
      this.errors.push(error);
    }else{
      if(!validTimeRegex.test(this.event.startingTimeString)){
        var error = new Error('Starting time format not valid. It should be HH:MM. Example 15:36');
        this.errors.push(error)
      }
    }
    if(!this.event.city || !this.event.country){
      // if city or country is missing show an error
      var error = new Error('City is missing.');
      this.errors.push(error);
    }

    // check optional params
    this.event.closingDateString = $('#closingDate').val();
    this.event.closingTimeString = $('#closingTime').val();
    if(this.event.closingTimeString){
      if(!validTimeRegex.test(this.event.closingTimeString)){
        var error = new Error('Closing time format not valid. It should be HH:MM. Example 15:36');
        this.errors.push(error)
      }
    }
    this.event.enrollmentOpeningDateString = $('#enrollmentOpeningDate').val();
    this.event.enrollmentOpeningTimeString = $('#enrollmentOpeningTime').val();
    if(this.event.enrollmentOpeningTimeString){
      if(!validTimeRegex.test(this.event.enrollmentOpeningTimeString)){
        var error = new Error('Enrolling opening time format not valid. It should be HH:MM. Example 15:36');
        this.errors.push(error)
      }
    }
    this.event.enrollmentClosingDateString = $('#enrollmentClosingDate').val();
    this.event.enrollmentClosingTimeString = $('#enrollmentClosingTime').val();
    if(this.event.enrollmentClosingTimeString){
      if(!validTimeRegex.test(this.event.enrollmentClosingTimeString)){
        var error = new Error('Enrolling closing time format not valid. It should be HH:MM. Example 15:36');
        this.errors.push(error)
      }
    }

    if(this.errors.length === 0){
      return true;
    }else{
      return false;
    }
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
    this.router.navigate(['/events/' + this.eventId + '/manage/route']);
    /*
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
     console.log('[EventManage][editRoute]');*/
  }
}
