import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import { Router } from '@angular/router';
import {EventService} from "../../shared/services/event.service";
import {Event} from "../../shared/models/event"
import {EventToCreate} from "../../shared/models/eventToCreate";
import {Error} from "../../shared/models/error";
import {DialogService} from "../../shared/dialog/dialog.service";
declare var $: any;

@Component({
  selector: 'app-event-create-page',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './event-create-page.component.html',
  styleUrls: ['./event-create-page.component.css']
})
export class EventCreatePageComponent implements OnInit {

  public eventTypes;

  public errors: Error[] = [];

  public event = new EventToCreate();
  public createdEvent: Event;

  public urlImage: any;
  public urlNoImage = '../../../assets/img/logofoto.png';

  public userSettingCity: any = {
    showSearchButton: false,
    geoTypes: ['(cities)'],
    showCurrentLocation: false,
    inputPlaceholderText: 'Milano'
  };

  constructor(private eventService: EventService, private router: Router, private dialogService: DialogService) {
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

  autocompleteCity(selectedData: any){
    for(let i=0; i< selectedData.data.address_components.length; i++){
      if(['administrative_area_level_3', 'locality'].indexOf(selectedData.data.address_components[i].types[0]) > -1) {
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
   *  When an image is uploaded, it reads the url and save the image
   * @param event
   */
  readUrl(event: any) {
    if(event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.onload = (event: any) => {
        this.urlImage = event.target.result;
      },
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
    // clean the errors
    this.errors = [];

    // the datepicker is not detected by angular form
    this.event.startingDateString = $('#startingDate.datepicker').val();

    // get the logo from the input image
    var logo = $('#logo').prop('files')[0];

    // if the form is valid, call the eventService
    if(this.isFormValid()){
      // add the logo to the event
      this.event.logo = logo;
      // call the service to create the event
      console.log('[EventCreate][onSubmit]', this.event);
      this.eventService.createEvent(this.event)
        .then(
          (response) => {
            console.log('[CreateEvent][onSubmit][success]', response);
            this.createdEvent = response as Event;
            this.dialogService.alert('Create event', 'The event has been succesfully created.', function () {
              this.router.navigate(['/events', this.createdEvent._id, 'manage']);
            }.bind(this));
          }
        )
        .catch(
          (errors) => {
            console.log('[CreateEvent][onSubmit][error]', errors);
            this.errors = errors;
          }
        )
    }
  }

  /**
   * It checks all the field in the form.
   * It returns true or false.
   * If there are any errors, it also shows them.
   */
  isFormValid(){
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
    if(!this.event.startingDateString){
      // if startingDate is missing show an error
      var error = new Error('Starting date is missing.');
      this.errors.push(error);
    }
    if(!this.event.startingTimeString){
      // if startingTime is missing show an error
      var error = new Error('Starting time is missing.');
      this.errors.push(error);
    }else{
      var validTimeRegex = /(00|01|02|03|04|05|06|07|08|09|10|11|12|13|14|15|16|17|18|19|20|21|22|23)[:](0|1|2|3|4|5)\d{1}/;
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

    if(this.errors.length === 0){
      return true;
    }else{
      return false;
    }
  }
}
