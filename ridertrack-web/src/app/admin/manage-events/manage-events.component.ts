import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { EventService } from '../../shared/services/event.service';
import { User } from '../../shared/models/user';
import { Event } from '../../shared/models/event';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../authentication/authentication.service';
import { Router } from "@angular/router";
import { DialogService } from "../../shared/dialog/dialog.service";
import { RouteService } from "../../shared/services/route.service";
import { FacebookService, UIParams, UIResponse, InitParams } from "ngx-facebook/dist/esm/index";
import {EventsListQueryParams} from "../../shared/models/eventsListQueryParams";

@Component({
  selector: 'app-manage-events',
  templateUrl: './manage-events.component.html',
  styleUrls: ['./manage-events.component.css']
})
export class ManageEventsComponent implements OnInit {

  private queryParams: EventsListQueryParams = new EventsListQueryParams;
  private totalPages: number = 0;
  private eventsList: Event[] = [];

  constructor(private route: ActivatedRoute,
    private userService: UserService,
    private eventService: EventService,
    private authService: AuthenticationService,
    private router: Router,
    private routeService: RouteService,
    private dialogService: DialogService,
    private fb: FacebookService) { }

  ngOnInit() {

    this.eventService.getAllEvents(this.queryParams)
    .then(
      (response) => {
        console.log('[AllEvents][getAllEvents]', response);
        this.eventsList = response[0];
        this.queryParams.page = response[1];
        this.queryParams.itemsPerPage = response[2];
        this.totalPages = response[3];
      });
  }


  eventClicked(event){
    this.dialogService.adminEditEvent('Edit event', event._id);
  }

}
