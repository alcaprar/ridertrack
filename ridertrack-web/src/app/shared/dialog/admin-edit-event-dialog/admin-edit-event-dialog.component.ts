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
  private callback;

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
    // init the plugin datepicker on the element
    $('.datepicker').datepicker({
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

  show(title, eventid, selection, callback) {
    this.errors = [];
    this.title = title;
    this.callback = callback;

    if(eventid){
      this.getEvent(eventid);
    }else {
      this.event = new Event();
      this.urlImage = null;
      this.userSettingCity = {
        showSearchButton: false,
        geoTypes: ['(cities)'],
        showCurrentLocation: false,
        inputPlaceholderText: 'Select a City'
      };
      this.ngAfterViewInit();
      $('#enrollmentOpeningDate.datepicker').datepicker("setDate" , new Date());
      $('#enrollmentClosingDate.datepicker').datepicker("setDate" , new Date());
      $('#closingDate').datepicker("setDate", new Date());
    }
    this.selection = selection;
    $('#adminEditEventDialog').modal('show');
  }

  getEvent(id){
    this.eventService.getEvent(id)
      .then((event)=> {
        this.event= event;
        this.urlImage = '/api/events/' + this.event._id + '/logo';
        this.userSettingCity = {
          showSearchButton: false,
          geoTypes: ['(cities)'],
          showCurrentLocation: false,
          inputPlaceholderText: this.event.city + ', '+ this.event.country
        };
        // init the input of the datepicker
        this.ngAfterViewInit();
        $('#closingDate').datepicker("setDate", new Date(this.event.closingDate));
        $('#enrollmentOpeningDate.datepicker').datepicker("setDate" , new Date(this.event.enrollmentOpeningDate));
        $('#enrollmentClosingDate.datepicker').datepicker("setDate" , new Date(this.event.enrollmentClosingDate));
      });
  }


  //save the changed date
  updateCloseDate(){
    this.event.enrollmentClosingDate = $('#enrollmentClosingDate').datepicker('getDate');
  }
  //save the changed date
  updateOpenDate(){
    this.event.enrollmentOpeningDate =  $('#enrollmentOpeningDate').datepicker('getDate');
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
      if(this.isFormValid()) {
        // get the logo from the input image
        this.event.logo = $('#logo').prop('files')[0];

        console.log('[EventManage][onSubmit]', this.event);
        console.log('[EventManage][onSubmit][enrollement]', this.event.enrollmentOpeningDate + '-' + this.event.enrollmentClosingDate);
        this.eventService.updateEventAdmin(this.event._id, this.event)
          .then(
            (response) => {
              if (response[0] !== null) {
                console.log('[CreateEvent][onSubmit][error]', response[0]);
                this.errors = response[0] as Error[];
              } else {
                var event: Event = response[1] as Event;
                console.log('[UpdateEvent][onSubmit][success]', event);
                this.callback();
                $('#adminEditEventDialog').modal('hide');
              }
            }
          );
      }
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
              console.log('[CreateEvent][onSubmit][Response]', response);
              if(response[0] !== null){
                // errors occureed
                this.errors = response[0] as Error[];
                console.log('[CreateEvent][onSubmit][Error]', response);
              }else{
                var createdEvent: Event = response[1] as Event;
                console.log('[CreateEvent][onSubmit][Success]', createdEvent);
                this.callback();
                $('#adminEditEventDialog').modal('hide');
              }
            }
          );
      }
    }
  }

  cancel(){
    this.errors=[];
    console.log('[adminEditEventDialog][cancel]');
    $('#adminEditEventDialog').modal('hide');
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
}
