import { Component, OnInit, Input } from '@angular/core';
import {Router} from "@angular/router";
import {DialogService} from "../../shared/dialog/dialog.service";
import {User} from "../../shared/models/user";
import {UserService} from "../../shared/services/user.service";

@Component({
  selector: 'app-event-box',
  templateUrl: './event-box.component.html',
  styleUrls: ['./event-box.component.css']
})
export class EventBoxComponent implements OnInit {

  @Input()
  event: any;

  @Input()
  enrolled: boolean;

  private currentUser: User = new User();

  constructor(private router: Router, private  dialogService:DialogService,private userService: UserService) { }

  ngOnInit() {
    console.log('[EventBox][Init]', this.event);
    this.userService.getUser()
      .subscribe(
        (user) => {
          this.currentUser = user
        });
  }

  addDevice() {
    this.dialogService.enrollement("Manage Enrollement", null, true, function () {
      this.dialogService.confirmation('Withdraw enrollment', 'Are you sure to withdraw your enrollment for this event?',
        function () {
          console.log('[ManageEnrollement][withdrawEnrollment][callback]');
          this.eventService.withdrawEnrollment(this.event._id, this.currentUser.id)
            .then(
              (response) => {
                console.log('[ManageEnrollement][withdrawEnrollment][success]', response);
                // get the new list of particpants to update the buttons
                this.getParticipants()
              }
            )
            .catch(
              (error) => {
                console.log('[ManageEnrollement][withdrawEnrollment][error]', error);
                //TODO: Show errors
              }
            );
        }.bind(this));
    }.bind(this));
  }
}
