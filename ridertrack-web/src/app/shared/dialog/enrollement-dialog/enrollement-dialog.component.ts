import {Component, OnChanges, OnInit, SimpleChanges, ViewEncapsulation} from '@angular/core';
import {DialogService} from "../dialog.service";
import {Router} from "@angular/router";
import {User} from "../../models";
import {EventService, UserService} from "../../services";
import {Device} from "../../models/device";

declare var $: any;

@Component({
  selector: 'app-enrollement-dialog',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './enrollement-dialog.component.html',
  styleUrls: ['./enrollement-dialog.component.css']
})
export class EnrollementDialogComponent implements OnInit{

  public title = 'Title';
  public isSelected: boolean;
  public isEnrolled: boolean;
  public eventId: string;
  public device: Device = null;

  public currentUser: User = new User();

  public errors: Error[] = [];

  constructor(private dialogService: DialogService, private router: Router, private userService: UserService,
              private eventService: EventService) {
    this.dialogService.register('enrollement', this);
    this.isSelected = false;
  }

  ngOnInit() {

  }

  getUser() {
    this.userService.getUser()
      .subscribe(
        (user) => {
          this.currentUser = user;
          if(this.isEnrolled){
            this.eventService.getEnrollement(this.currentUser.id, this.eventId)
              .then((enrollment)=> {
                console.log("[EnrollementDialog][GetEnrollement][Success]", enrollment);
                if(enrollment.device.deviceId !== null) {
                  console.log("[EnrollementDialog][GetEnrollement][DeviceDetected]");
                  this.device = new Device(enrollment.device.deviceType, enrollment.device.deviceId);
                }
              }).catch((err)=> {
              console.log("[EnrollementDialog][OnInit][getEnrollement][Error]", err);
              this.errors = err;
            })
          }
        });
  }

  show(title, eventId, isEnrolled){
    console.log('[EnrollementDialog][show]', title);
    this.errors = [];
    this.title = title;
    this.eventId = eventId;
    this.isEnrolled = isEnrolled;
    this.getUser();
    if(this.isSelected){
      $('#form').modal('show');
    }else {
      $('#form').modal('hide');
    }
    $('#enrollementDialog').modal('show');
  }

  save(){
    console.log('[EnrollementDialog][Save]');
    if($('#device-spotgen').is(':checked')){
      this.device = new Device("spot-gen-3", $('#spotgenId').val());
    }
    this.enroll();
  }

  skip(){
    console.log('[ConfirmationDialog][Skip]');
    $('#enrollementDialog').modal('hide');
  }

  update(){
    if($('#device-spotgen').is(':checked')){
      this.device = new Device("spot-gen-3", $('#spotgenId').val());
    }
    this.updateEnrollement();
  }

  /**
   * It is triggered when the user clicks the button.
   * It calls the eventService in order to enroll the user passing also the selected devices.
   */
  private enroll(){
    this.errors = [];
    this.eventService.enrollToEvent(this.eventId, this.device)
      .then(
        (response) => {
          console.log('[Enroll][success]', response);
          $('#enrollementDialog').modal('hide');
          $('#form').modal('hide');
        }
      )
      .catch(
        (errors) => {
          console.log('[Enroll][error]', errors);
          this.errors = errors
        });
  }

  private updateEnrollement() {
    this.eventService.updateEnrollement(this.eventId, this.device, this.currentUser.id)
      .then(response=>{
        console.log('[Enroll][Update][success]');
        $('#enrollementDialog').modal('hide');
        $('#form').modal('hide');
      }).catch((errors)=> {
      console.log('[Enroll][error]');
      this.errors = errors
    });
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
