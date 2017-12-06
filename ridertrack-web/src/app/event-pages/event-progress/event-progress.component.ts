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
      }
    )
      .catch(
      (error) => {
        console.log('[Participants Management][OnInit][error]', error);
      }
      );

    this.routeService.getRoute(this.eventId)
      .then(
      (coordinates) => {
        console.log('[Route Management][OnInit][success]', coordinates);
        if (coordinates === null || coordinates === undefined) {
          this.mapPoints = [];
          this.firstRoute = true;
        } else {
          this.mapPoints = coordinates;
          this.firstRoute = false;
          // this.getRoutePointsAndWaypoints();
        }
      }
      )
      .catch(
      (error) => {
        console.log('[Route Management][OnInit][error]', error);
      }
      );

    this.initMap();
  }

  initMap() {

    //set up current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.initLat = position.coords.latitude;
        this.initLong = position.coords.longitude;
        console.log("[Geolocated]", position.coords);
      });
    }

    //add listener to Input search
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          this.initLat = place.geometry.location.lat();
          this.initLong = place.geometry.location.lng();
          this.zoom = 17;

          console.log("[Show area inserted]" + "[Lng]" + this.initLong + "[Lat]" + this.initLong);
        })
      })
    });
  }


}
