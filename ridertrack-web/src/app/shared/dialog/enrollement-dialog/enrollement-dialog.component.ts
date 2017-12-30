import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {DialogService} from "../dialog.service";
import {Router} from "@angular/router";
import {User} from "../../models";
import {EventService, UserService} from "../../services";

declare var $: any;

@Component({
  selector: 'app-enrollement-dialog',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './enrollement-dialog.component.html',
  styleUrls: ['./enrollement-dialog.component.css']
})
export class EnrollementDialogComponent implements OnInit {

  private title = 'Title';
  private isSelected: boolean;
  private isEnrolled: boolean;
  private eventId: string;
  private device: {deviceType: string, deviceId: string};

  private currentUser: User = new User();

  constructor(private dialogService: DialogService, private router: Router, private userService: UserService,
              private eventService: EventService) {
    this.dialogService.register('enrollement', this);
    this.isSelected= false;
  }

  ngOnInit() {
    this.userService.getUser()
      .subscribe(
        (user) => {
          this.currentUser = user
        });
  }

  show(title, eventId, isEnrolled, device){
    console.log('[EnrollementDialog][show]', title);
    this.title = title;
    this.eventId = eventId;
    this.isEnrolled = isEnrolled;
    this.device = device;
    if(this.isSelected){
      $('#form').modal('show');
    }else {
      $('#form').modal('hide');
    }
    $('#enrollementDialog').modal('show');
  }

  save(){
    console.log('[EnrollementDialog][Save]');
    this.device.deviceId =$('#spotgenId').value;
    this.device.deviceType = "Spot gen";
    this.enroll();
    $('#enrollementDialog').modal('hide');
    $('#form').modal('hide');
  }

  skip(){
    console.log('[ConfirmationDialog][Skip]');
    this.device = null;
    this.enroll();
    $('#enrollementDialog').modal('hide');
  }

  private enroll(){
    this.eventService.enrollToEvent(this.eventId, this.device)
      .then(
        (response) => {
          console.log('[Enroll][success]', response);
        }
      )
      .catch(
        (error) => {
          console.log('[EventDetail][enroll][error]', error);
        });
  }

  private updateEnrollement() {
    this.eventService.updateEnrollement(this.eventId, this.device);
  }

  changeRadioButton() {
    if(this.isSelected){
      this.isSelected = false;
      $('#form').modal('hide');
    }else {
      this.isSelected = true;
      $('#form').modal('show');
    }
    console.log("[Selection Changed][Spot Gen] "+ this.isSelected);
  }

  withdrawEnrollement() {
    this.dialogService.confirmation('Withdraw enrollment', 'Are you sure to withdraw your enrollment for this event?',
      function () {
        console.log('[EventDetail][withdrawEnrollment][callback]');
        this.eventService.withdrawEnrollment(this.eventId, this.currentUser.id)
          .then(
            (response) => {
              console.log('[EventDetail][withdrawEnrollment][success]', response);
              // get the new list of particpants to update the buttons
              this.getParticipants()
            }
          )
          .catch(
            (error) => {
              console.log('[EventDetail][withdrawEnrollment][error]', error);
              this.errors = error;
            }
          );
      }.bind(this));
  $('#enrollementDialog').modal('hide');
  }
}
