import { Component, NgZone, OnInit} from '@angular/core';
import { MapsAPILoader} from "@agm/core";
import { EventService } from '../../shared/services/event.service';
import { Event } from '../../shared/models/event';
import { } from '@types/googlemaps';
import { RouteService } from "../../shared/services/route.service";
import { ActivatedRoute, Router } from "@angular/router";
import {ParticipantProgress} from "../../shared/models/participantProgress";

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
  public lat: number;
  public lng: number;

  public mapPoints; //latLng array
  directions: any;

  private eventId: String;
  private participantsList: any;
  private event: Event = new Event;
  private city: any;
  travelModeInput = "WALKING";
  private initMarker: {lat:number, lng: number};

  private participantsMarkers = [];

  private refreshInterval;

  constructor(private mapsAPILoader: MapsAPILoader, private ngZone: NgZone, private routeService: RouteService,
    private route: ActivatedRoute, private router: Router, private eventService: EventService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.eventId = params['eventId'];
      console.log('[Progress Management][OnInit]', this.eventId);

      this.eventService.getEvent(this.eventId)
        .then(
          (event) => {
            this.event = event;

            // check the status
            if(this.event.status === 'ongoing'){
              // retrieve the last position every 5 seconds
              this.refreshInterval = setInterval(
                ()=>{
                  this.eventService.getLastPositions(this.eventId)
                    .then((participantsProgress) => {
                      console.log("[Progress Management][OnInit][GetLastPositions][Success]", participantsProgress);
                      this.transformParticipantsMaker(participantsProgress);
                    }).catch((error)=> {
                    console.log("[Progress Management][OnInit][GetLastPositions][Error]", error);
                    //TODO: Show errors
                  })
                }, 5 * 1000);
            }
          }
        );

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
            console.log('[Progress Management][OnInit][success]', coordinates);
            console.log('[Progress Management][OnInit][Coordinates detected]', coordinates);
            this.mapPoints = coordinates;
            this.initMap();
          })
        .catch((error) => {
          console.log('[Progress Management][OnInit][error]', error);
        });
    });

  }

  /**
   * It goes through the data received from the service and creates an array of markers.
   * @param participantsProgress
     */
  transformParticipantsMaker(participantsProgress){
    // clean the previous markers
    this.participantsMarkers = [];
    for(let i = 0; i < participantsProgress.length; i++){
      this.participantsMarkers.push({
        lat: Number(participantsProgress[i].lastPosition.lat),
        lng: Number(participantsProgress[i].lastPosition.lng),
        label: participantsProgress[i].userId
      })
    }
  }

  /**
   * It is called when the user changes page.
   * It stop the interval to retrieve the positions of the users.
   */
  ngOnDestroy(){
    if(this.refreshInterval){
      clearInterval(this.refreshInterval)
    }
  }

  initMap() {

    if (this.mapPoints.length > 0) {
      console.log('Route exists');
      this.initLat = this.mapPoints[0].lat;
      this.initLong = this.mapPoints[0].lng;
      this.getRoutePointsAndWaypoints();
    }
    else {
      console.log('[Event Progress][Zoom to the event city]');
      this.eventService.getEvent(this.eventId)
        .then(
        (event) => {
          console.log('[Event Progress][OnInit][EventService.getEvent][success]', event);
          this.event = event;
          var address = this.event.city;
          var geocoder = new google.maps.Geocoder();
          geocoder.geocode({ 'address': address }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              this.initLat = results[0].geometry.location.lat();
              this.initLong = results[0].geometry.location.lng();
              this.initMarker = {lat: this.initLat,lng:this.initLong};
              console.log('[Event Progress][city coordinates] lat: ' + this.initLat + ' lng: ' + this.initLong + 'marker:'
              +this.initMarker);
            }
          });
        })
        .catch(
        (error) => {
          console.log('[Event Progress][OnInit][EventService.getEvent][error]', error);
          //TODO: Show errors
        });
    }
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
