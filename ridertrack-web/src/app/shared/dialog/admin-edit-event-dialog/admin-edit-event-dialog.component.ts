///<reference path="../../models/event.ts"/>
import {DialogService} from "../dialog.service";
import { Event } from '../../models/event';
import {AfterViewInit, Component, Injectable, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {EventService} from "../../services/event.service";
import { DatePipe } from '@angular/common';
import {Error} from "../../models/error";
declare var $: any;

@Component({
  selector: 'app-admin-edit-event-dialog',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './admin-edit-event-dialog.component.html',
  styleUrls: ['./admin-edit-event-dialog.component.css']
})
export class AdminEditEventDialogComponent implements OnInit, AfterViewInit {

  private eventTypes;

  private eventId: string;
  private event:Event = new Event();
  time:Date = new Date();

  private urlImage: any;
  private urlNoImage = '../../../assets/img/logofoto.png';

  errors: Error[] = [];
  public userSettingCity: any;

  private title = 'Title';
  private selection: string;

  constructor(private eventService: EventService, private router: Router,
              private route: ActivatedRoute,private dialogService: DialogService) {
    this.dialogService.register('adminEditEvent', this);
    this.eventTypes = this.eventService.getEventTypes();
  }

  ngOnInit() {
    this.eventTypes = this.eventService.getEventTypes();
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

  show(title, event, selection) {

    this.title = title;

    if(event){
      this.event = event;
      this.urlImage = '/api/events/' + this.event._id + '/logo';
      this.userSettingCity = {
        showSearchButton: false,
        geoTypes: ['(cities)'],
        showCurrentLocation: false,
        inputPlaceholderText: this.event.city + ', '+ this.event.country
      };
      // init the input of the datepicker
      $('#enrollmentOpeningAt.datepicker').datepicker("setDate" , new Date(this.event.enrollmentOpeningAt));
      $('#enrollmentClosingAt.datepicker').datepicker("setDate" , new Date(this.event.enrollmentClosingAt));
    }else {
      this.event = new Event();
      this.urlImage = null;
      this.userSettingCity = {
        showSearchButton: false,
        geoTypes: ['(cities)'],
        showCurrentLocation: false,
        inputPlaceholderText: 'Select a City'
      };
    }
    this.selection = selection;
    $('#adminEditEventDialog').modal('show');
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


  save() {
    if(this.selection === 'edit'){
      this.event.startingDate = $('#startingDate.datepicker').val();
      this.event.enrollmentOpeningAt = $('#enrollmentOpeningAt.datepicker').datepicker("getDate" );
      this.event.enrollmentClosingAt = $('#enrollmentClosingAt.datepicker').datepicker("getDate" );

      // get the logo from the input image
      this.event.logo = $('#logo').prop('files')[0];
      console.log('[EventManage][onSubmit][enrollement]',this.event.enrollmentOpeningAt+'-'+ this.event.enrollmentClosingAt);
      this.eventService.updateEvent(this.event._id, this.event)
        .then(
          (response) => {
            console.log('[UpdateEvent][onSubmit][success]', response);
            if(response[0] !== null){
              // errors occureed
              this.errors = response[0] as Error[];
            }else{
              var event: Event = response[1] as Event;
            }
          }
        )
        .catch(
          (error) => {
            console.log('[CreateEvent][onSubmit][error]', error);
          }
        );
    }
    if(this.selection === 'create'){
      // clean the errors
      this.errors = [];
      // the datepicker is not detected by angular form
      this.event.startingDate = $('#startingDate.datepicker').val();
      // get the logo from the input image
      var logo = $('#logo').prop('files')[0];
      if(!this.event.type){
        // if type is missing show an error
        var error = new Error('Type is missing.');
        this.errors.push(error);
      }else{
        // add the logo to the event
        this.event.logo = logo;
        // call the service to create the event
        console.log('[EventCreate][onSubmit]', this.event);
        this.eventService.createEvent(this.event)
          .then(
            (response) => {
              console.log('[CreateEvent][onSubmit][success]', response);
              if(response[0] !== null){
                // errors occureed
                this.errors = response[0] as Error[];
              }else{
                var createdEvent: Event = response[1] as Event;
              }
            }
          )
          .catch(
            (error) => {
              console.log('[CreateEvent][onSubmit][error]', error);
            }
          )
      }
    }
    $('#adminEditEventDialog').modal('hide');
  }

  cancel(){
    console.log('[adminEditEventDialog][cancel]');
    $('#adminEditEventDialog').modal('hide');
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

    console.log('[EventManage][onSubmit]',$('#enrollmentOpeningAt.datepicker').datepicker("getDate" ));
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

}
