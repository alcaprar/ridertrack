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
import {SortService} from "../../event-pages/event-progress/sort.service";

@Component({
  selector: 'app-manage-events',
  templateUrl: './manage-events.component.html',
  styleUrls: ['./manage-events.component.css']
})
export class ManageEventsComponent implements OnInit {

  private queryParams: EventsListQueryParams = new EventsListQueryParams;
  private totalPages: number = 0;
  private eventsList: Event[] = [];

  constructor(private userService: UserService,private eventService: EventService, private dialogService: DialogService,
              private sortService: SortService) { }

  ngOnInit() {
      this.getEvents();
  }

  getEvents() {
    this.eventService.getAllEvents(this.queryParams)
      .then(
        (response) => {
          console.log('[AllEvents][getAllEvents]', response);
          this.eventsList = response[0];
          this.queryParams.page = response[1];
          this.queryParams.itemsPerPage = response[2];
          this.totalPages = response[3];
          this.sortService.sortTable({sortColumn: 'date', sortDirection:'asc'}, this.eventsList);
        });

  }

  edit(event){
  this.dialogService.adminEditEvent("Edit Event", event, 'edit');
  this.getEvents();
  }

  createEvent(){
    this.dialogService.adminEditEvent("Create Event", null, 'create');
    this.getEvents();
  }

  delete(event){
    this.dialogService.confirmation("Delete Event", "Are you sure to delete this event?", function () {
      this.eventService.deleteEvent(event._id);
    }.bind(this));
    this.getEvents();
  }

  onSorted($event){
    this.sortService.sortTable($event, this.eventsList);
  }

  getParticipants(event){
    let participants = [];
    let userIds;
    this.eventService.getParticipants(event._id)
      .then((response)=> {
        userIds = response;
        console.log("[GetListOfIds]", userIds);
        for(let id of userIds){
          this.eventService.getEnrollement(id, event._id).then((enrollement)=>{
            participants.push(enrollement.user);
          });
        }
      });
    //TODO: SHOW PARTICIPANTS LIST IN A DIALOG PASSING "participants"
  }

}
