import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {DialogService} from "../dialog.service";
import {Router} from "@angular/router";
import {User} from "../../models";
import {UserService} from "../../services";

declare var $: any;

@Component({
  selector: 'app-enrollement-dialog',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './enrollement-dialog.component.html',
  styleUrls: ['./enrollement-dialog.component.css']
})
export class EnrollementDialogComponent implements OnInit {

  private callback;
  private callbackWithdrawEnrollement;
  private title = 'Title';
  private isSelected: boolean;
  private isEnrolled: boolean;

  private currentUser: User = new User();

  constructor(private dialogService: DialogService, private router: Router, private userService: UserService) {
    this.dialogService.register('enrollement', this);
    this.isSelected= false;
  }

  ngOnInit() {
    this.userService.getUser()
      .subscribe(
        (user) => {
          this.currentUser = user
        });
    //TODO: Get current option of the enrollement for the user
  }

  show(title, callback, isEnrolled, callbackWithdrawEnrollement){
    console.log('[EnrollementDialog][show]', title);
    this.title = title;
    this.callback = callback;
    this.isEnrolled = isEnrolled;
    this.callbackWithdrawEnrollement = callbackWithdrawEnrollement;
    if(this.isSelected){
      $('#form').modal('show');
    }else {
      $('#form').modal('hide');
    }
    $('#enrollementDialog').modal('show');
  }

  save(){
    console.log('[EnrollementDialog][Save]');
    if(this.callback) {
      this.callback();
    }
    //TODO: Save enrollement option in the backend
    $('#enrollementDialog').modal('hide');
    $('#form').modal('hide');
  }

  skip(){
    console.log('[ConfirmationDialog][Skip]');
    if(this.callback) {
      this.callback();
    }
    $('#enrollementDialog').modal('hide');
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
  this.callbackWithdrawEnrollement();
  $('#enrollementDialog').modal('hide');
  }
}
