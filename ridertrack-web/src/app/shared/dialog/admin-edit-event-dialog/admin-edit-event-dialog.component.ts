///<reference path="../../models/event.ts"/>
import {DialogService} from "../dialog.service";
import { Event } from '../../models/event';
import {Component, Injectable, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {EventService} from "../../services/event.service";
import { DatePipe } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-admin-edit-event-dialog',
  templateUrl: './admin-edit-event-dialog.component.html',
  styleUrls: ['./admin-edit-event-dialog.component.css']
})
export class AdminEditEventDialogComponent implements OnInit {

  private eventTypes;

  eventId: string;
  event:Event = new Event();
  time:Date = new Date();

  private urlImage: any;
  private urlNoImage = '../../../assets/img/logofoto.png';

  errors: Error[] = [];
  public userSettingCity: any;

  private callback;
  private title = 'Title';
  private body = 'Body';

  constructor(private eventService: EventService, private router: Router, private route: ActivatedRoute,private dialogService: DialogService) {
    this.dialogService.register('adminEditEvent', this)
  }

  ngOnInit() {
    // load the event using eventId
    this.eventService.getEvent('5a2c3e338c419d1e280ba38d')
    .then(
      (event) => {
        console.log('[AdminEventManage][OnInit][getEvent][success]', event);
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
      }
    ) 
  }


  show(title, body) {
    console.log('[adminEditEventDialog][show]', title, body);
    this.title = title;
    this.body = body;
    $('#adminEditEventDialog').modal('show');

  }

  ok() {
    console.log('[adminEditEventDialog][ok]');
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
