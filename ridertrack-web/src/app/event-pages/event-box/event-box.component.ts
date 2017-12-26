import { Component, OnInit, Input } from '@angular/core';
import {Router} from "@angular/router";
import {DialogService} from "../../shared/dialog/dialog.service";

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

  constructor(private router: Router, private  dialogService:DialogService) { }

  ngOnInit() {
    console.log('[EventBox][Init]', this.event)
  }

  addDevice() {
    this.dialogService.enrollement("Add Tracking Device", function () {

    });
  }
}
