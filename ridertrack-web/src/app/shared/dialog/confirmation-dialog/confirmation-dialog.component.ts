import { Component, OnInit } from '@angular/core';
import {DialogService} from "../dialog.service";
declare var $: any;


@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent implements OnInit {

  private callback;
  private title = 'Title'
  private body = 'Body';

  constructor(private dialogService: DialogService) {
    this.dialogService.register('confirmation', this)
  }

  ngOnInit() {
  }

  show(title, body, callback){
    console.log('[ConfirmationDialog][show]', title, body);
    this.title = title;
    this.body = body;
    this.callback = callback;
    $('#confirmationDialog').modal('show');

  }

  confirm(){
    console.log('[ConfirmationDialog][confirm]');
    this.callback();
    $('#confirmationDialog').modal('hide');
  }

  cancel(){
    console.log('[ConfirmationDialog][cancel]');
    $('#confirmationDialog').modal('hide');
  }

}
