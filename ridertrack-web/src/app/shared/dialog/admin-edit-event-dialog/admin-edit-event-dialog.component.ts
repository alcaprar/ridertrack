
import { Component, OnInit } from '@angular/core';
import {DialogService} from "../dialog.service";
import { Event } from '../../models/event';
declare var $: any;

@Component({
  selector: 'app-admin-edit-event-dialog',
  templateUrl: './admin-edit-event-dialog.component.html',
  styleUrls: ['./admin-edit-event-dialog.component.css']
})
export class AdminEditEventDialogComponent implements OnInit {

  private callback;
  private title = 'Title';
  private body = 'Body';

  constructor(private dialogService: DialogService) {
    this.dialogService.register('adminEditEvent', this)
  }

  ngOnInit() {
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

}
