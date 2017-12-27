import { Component, OnInit } from '@angular/core';
import {DialogService} from "../dialog.service";
import {Router} from "@angular/router";

declare var $: any;

@Component({
  selector: 'app-enrollement-dialog',
  templateUrl: './enrollement-dialog.component.html',
  styleUrls: ['./enrollement-dialog.component.css']
})
export class EnrollementDialogComponent implements OnInit {

  private callback;
  private title = 'Title';
  private isSelected: boolean;

  constructor(private dialogService: DialogService, private router: Router) {
    this.dialogService.register('enrollement', this);
    this.isSelected= false;
  }

  ngOnInit() {
  }

  show(title, callback){
    console.log('[EnrollementDialog][show]', title);
    this.title = title;
    this.callback = callback;
    if(this.isSelected){
      $('#form').modal('show');
    }else {
      $('#form').modal('hide');
    }
    $('#enrollementDialog').modal('show');
  }

  save(){
    console.log('[EnrollementDialog][Save]');
    this.callback();
    //TODO: SAVE ID IN THE BACKEND ASSOCIATED TO THE USER
    $('#enrollementDialog').modal('hide');
    $('#form').modal('hide');
  }

  skip(){
    console.log('[ConfirmationDialog][Skip]');
    this.callback();
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

}
