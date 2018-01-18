import { Component, OnInit } from '@angular/core';
import {DialogService} from "../dialog.service";
declare var $: any;


@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.css']
})
export class AlertDialogComponent implements OnInit {

  public callback;
  public title = 'Title';
  public body = 'Body';

  constructor(private dialogService: DialogService) {
    this.dialogService.register('alert', this)
  }

  ngOnInit(){

  }

  ngAfterViewInit() {
    var dialog = this;
    $('#alertDialog').on('hidden.bs.modal', function () {
      console.log('nascosto', dialog.callback);
      if(dialog.callback && typeof dialog.callback === 'function'){
        dialog.callback()
      }
    })
  }

  show(title, body, callback){
    console.log('[AlertDialog][show]', title, body, callback);
    this.title = title;
    this.body = body;
    this.callback = callback;
    $('#alertDialog').modal('show');
  }

  ok(){
    console.log('[AlertDialog][ok]');
    $('#alertDialog').modal('hide');
  }

}
