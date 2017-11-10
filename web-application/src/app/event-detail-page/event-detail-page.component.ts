import { Component, OnInit } from '@angular/core';
import {UserService} from "../_services/user.service";

@Component({
  selector: 'app-event-detail-page',
  templateUrl: './event-detail-page.component.html',
  styleUrls: ['./event-detail-page.component.css']
})
export class EventDetailPageComponent implements OnInit {

  private eventTitle: string;
  private registrationStatus: string;

  //to change with the title retrieved from the server
  constructor(user: UserService) {
    this.eventTitle="London Marathon 2017",
      this.registrationStatus= "Open"
  }

  ngOnInit() {
  }

}
