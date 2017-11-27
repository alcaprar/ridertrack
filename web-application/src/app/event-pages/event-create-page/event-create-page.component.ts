import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {EventService} from "../../shared/services/event.service";
import {EventToCreate} from "../../shared/models/eventToCreate";
import {AlertService} from "../../shared/services/alert.service";
import {Error} from "../../shared/models/error";
declare var $: any;

@Component({
  selector: 'app-event-create-page',
  templateUrl: './event-create-page.component.html',
  styleUrls: ['./event-create-page.component.css']
})
export class EventCreatePageComponent implements OnInit {

  private eventTypes;

  private errors: Error[] = [];

  event = new EventToCreate();

  private urlImage: any;
  private urlNoImage = '../../../assets/img/logofoto.png';

  constructor(private eventService: EventService, private router: Router, private  alertService: AlertService) {
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
    this.router.navigate(['my-events']);
  }

  /**
   * It is called when the user clicks on the create button.
   * It calls the method of event service waiting for a response.
   */
  onSubmit(){
    // clean the errors
    this.errors = [];

    // the datepicker is not detected by angular form
    this.event.startingDate = $('#startingDate.datepicker').val();

    // get the logo from the input image
    var logo = $('#logo').prop('files')[0];

    if(!logo) {
      // if logo is missing show an error
      var error = new Error('Logo is missing.');
      this.errors.push(error);
    }else if(!this.event.type){
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
              this.router.navigate(['/events/' + event._id]);
            }
            // this.alertService.success("Event successfully created");
          }
        )
        .catch(
          (error) => {
            console.log('[CreateEvent][onSubmit][error]', error);
            // this.alertService.error("An error occured: "+ error.message);
            this.router.navigate(['/create-event']);
          }
        )
    }
  }
}
