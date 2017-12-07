import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { MapsAPILoader, MouseEvent as AGMMouseEvent } from "@agm/core";
import { EventService } from '../../shared/services/event.service';
import { UserService } from '../../shared/services/user.service';
import { User } from '../../shared/models/user';
import { Event } from '../../shared/models/event';
import { } from '@types/googlemaps';
import { FormControl } from "@angular/forms";
import { RouteService } from "../../shared/services/route.service";
import { ActivatedRoute, Router } from "@angular/router";
import { isNullOrUndefined } from "util";

declare var google: any;

@Component({
  selector: 'app-event-progress',
  templateUrl: './event-progress.component.html',
  styleUrls: ['./event-progress.component.css']
})
export class EventProgressComponent implements OnInit {

  public initLat: number;
  public initLong: number;
  public zoom = 15;
  public searchControl: FormControl = new FormControl();

  public mapPoints; //latLng array
  directions: any;
  travelModeInput: string = 'WALKING';

  private eventId: String;
  private firstRoute: boolean;
  private participantsList: any;

  private userPosition: {
    lat: 45.31411230740029,
    lng: 14.173370342254639
  }

  @ViewChild("search")
  public searchElementRef: ElementRef;

  constructor(private mapsAPILoader: MapsAPILoader, private ngZone: NgZone, private routeService: RouteService,
    private route: ActivatedRoute, private router: Router, private eventService: EventService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.eventId = params['eventId'];
      console.log('[Route Management][OnInit]', this.eventId);
    });

    this.eventService.getParticipants(this.eventId).then(
      (participants) => {
        console.log('[Participants Management][OnInit][success]', participants);
        if (participants != null) {
          this.participantsList = participants;
        }
      })
      .catch(
      (error) => {
        console.log('[Participants Management][OnInit][error]', error);
      });

    this.routeService.getRoute(this.eventId)
      .then(
      (coordinates) => {
        console.log('[Route Management][OnInit][success]', coordinates);
        if (coordinates === null || coordinates === undefined) {
          this.mapPoints = [];
          // this.firstRoute = true;
        } else {
          this.mapPoints = coordinates;
          // this.firstRoute = false;
          this.getRoutePointsAndWaypoints();
          this.initMap();
        }
      })
      .catch(
      (error) => {
        console.log('[Route Management][OnInit][error]', error);
      });
  }

  initMap() {
    navigator.geolocation.getCurrentPosition(position => {
      this.initLat = this.mapPoints[0].lat;
      this.initLong = this.mapPoints[0].lng;
      console.log("[Init map]", position);
    });
  }

  getRoutePointsAndWaypoints() {
    let waypoints = [];

    if (this.mapPoints.length > 2) {
      for (let i = 1; i < this.mapPoints.length - 1; i++) {
        let address = this.mapPoints[i];
        if (address !== "") {
          waypoints.push({
            location: address,
            stopover: false //show marker on map for each waypoint (true)
          });
        }
        this.updateDirections(this.mapPoints[0], this.mapPoints[this.mapPoints.length - 1], waypoints);
      }
    } else if (this.mapPoints.length > 1) {
      this.updateDirections(this.mapPoints[this.mapPoints.length - 2], this.mapPoints[this.mapPoints.length - 1], waypoints);
    } else {
      this.updateDirections(this.mapPoints[this.mapPoints.length - 1], this.mapPoints[this.mapPoints.length - 1], waypoints);
    }
  }

  updateDirections(originAddress, destinationAddress, waypoints) {
    this.directions = {
      origin: { lat: originAddress.lat, lng: originAddress.lng },
      destination: { lat: destinationAddress.lat, lng: destinationAddress.lng },
      waypoints: waypoints
    };
    console.log("[Directions][Update]", this.directions);
  }


}
