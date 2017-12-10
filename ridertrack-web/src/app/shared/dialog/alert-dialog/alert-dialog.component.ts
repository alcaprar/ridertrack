import { Component, OnInit } from '@angular/core';
import {DialogService} from "../dialog.service";
declare var $: any;


@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.css']
})
export class AlertDialogComponent implements OnInit {

  private callback;
  private title = 'Title';
  private body = 'Body';

  constructor(private dialogService: DialogService) {
    this.dialogService.register('alert', this)
  }

  ngOnInit() {
  }

  show(title, body){
    console.log('[AlertDialog][show]', title, body);
    this.title = title;
    this.body = body;
    $('#alertDialog').modal('show');

  }

  ok(){
    console.log('[AlertDialog][ok]');
    $('#alertDialog').modal('hide');
  }

}
