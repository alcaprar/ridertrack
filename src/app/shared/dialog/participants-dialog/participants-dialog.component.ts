import { Component, OnInit } from '@angular/core';
import {DialogService} from "../dialog.service";

declare var $ : any;

@Component({
  selector: 'app-participants-dialog',
  templateUrl: './participants-dialog.component.html',
  styleUrls: ['./participants-dialog.component.css']
})
export class ParticipantsDialogComponent implements OnInit {

  public participants = [];

  constructor(private dialogService: DialogService) {
    this.dialogService.register('participants', this)
  }

  ngOnInit() {
  }

  show(participants){
    console.log('[ParticipantsDialog][show]', participants);
    this.participants = participants;
    $('#participantDialog').modal('show');
  }

  ok(){
    $('#participantDialog').modal('hide');
  }
}
