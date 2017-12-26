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
    $('#enrollementDialog').modal('show');
  }
  save(){
    console.log('[EnrollementDialog][Save]');
    this.callback();
    if(this.isSelected ){
      this.router.navigate(["configuration"]);
    }
    $('#enrollementDialog').modal('hide');

  }

  skip(){
    console.log('[ConfirmationDialog][Skip]');
    this.callback();
    $('#enrollementDialog').modal('hide');
  }

  changeRadioButton() {
    if(this.isSelected){
      this.isSelected = false;
    }else {
      this.isSelected = true;
    }
    console.log("[Selection Changed][Spot Gen] "+ this.isSelected);
  }

}
