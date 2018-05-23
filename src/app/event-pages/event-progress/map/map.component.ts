import {Component, ElementRef, Input, NgZone, OnInit, ViewChild} from '@angular/core';
import { MapsAPILoader} from "@agm/core";
import {EventService, UserService} from '../../../shared/services/index';
import { } from '@types/googlemaps';
import { RouteService } from "../../../shared/services/route.service";
import { ActivatedRoute, Router } from "@angular/router";
import {Event} from '../../../shared/models/event';
import {User} from "../../../shared/models";
import {DialogService} from "../../../shared/dialog/dialog.service";

declare var $:any;
declare var google: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  public initLat: number;
  public initLong: number;
  public zoom = 15;
  public bounds:any;
  public currentUser = new User();
  public eventOrganizer = new User();


  public mapPoints; //latLng array
  public directions: any;

  public event= new Event();
  public eventId;
  public participantsList: any = [];
  public participantsMarkers : Progress[] = [];
  public selectedType: string = '';

  public refreshInterval;

  public participantSelected : String = "";

  public marker_background_colors = ["green", "red", "yellow", "orange", "purple", "pink",
    "blue", "black", "gray", "white", "brown"];

  public lastUpdate = new Date();

  @ViewChild('searchType') searchType: ElementRef;

  constructor(private mapsAPILoader: MapsAPILoader, private ngZone: NgZone, private routeService: RouteService,
              private router: Router, private eventService: EventService, private route: ActivatedRoute,
              private userService: UserService, private dialogService: DialogService) { }

  ngOnInit() {

    this.route.parent.params.subscribe(params => {
      this.eventId = params['eventId'];
      console.log('[Map][OnInit][EventId]', this.eventId);
    });

    this.getUser();

    this.eventService.getEvent(this.eventId)
      .then(
        (event) => {
          this.event = event;
          this.getOrganizer();
          // check the status
          if(this.event.status === 'ongoing'){
            // retrieve the last position every 5 seconds
            this.initUsersPositions();
            this.refreshInterval = setInterval(
              ()=>{
                this.getLastPositions()
              }, 10 * 1000);
            this.eventService.getParticipants(this.eventId)
              .then(
                (participants) => {
                  console.log('[EventProgress Map][OnInit][EventService.getParticipants]', participants);
                  this.participantsList = participants;
                }
              );
          }
        });
    this.routeService.getRoute(this.eventId)
      .then(
        (route) => {
          console.log('[Progress Management][OnInit][success]', route);
          this.mapPoints = route.coordinates as [{lat:number, lng:number}];
          this.selectedType = route.type;
          this.initMap();
        })
      .catch((error) => {
        console.log('[Progress Management][OnInit][error]', error);
      });
  }

  getUser() {
    this.userService.getUser()
      .subscribe(
        (user) => {
          this.currentUser = user;
          console.log('[MapProgress][getUser][success]', user);
        });
  }

  stopTracking() {
    this.dialogService.confirmation("Stop Event",
      "Are you sure to stop the event?",function(){
        this.eventService.stopTracking(this.event)
          .then((success) => {
            console.log("[Stop Tracking][Success]");
            this.event.status = "passed";
            this.router.navigate(['/events', this.event._id]);
          }).catch((error) => {
          console.log("[Stop Tracking][Error]", error);
        });
      }.bind(this));
  }

  getOrganizer() {
    this.eventService.getOrganizer(this.eventId)
      .then(
        (organizer) => {
          console.log('[MapProgress][getOrganizer][success]', organizer);
          this.eventOrganizer = organizer;
        }
      )
      .catch(
        (error) => {
          console.log('[MapProgress][getOrganizer][error]', error);
        }
      )
  }

  /**
   * Called after the page has been rendered.
   * It initializes some UI components.
   */
  ngAfterViewInit() {
    setTimeout(function () {
      console.log("Map page view init", $('.selectpicker'));
      $('.selectpicker').selectpicker("render");
    }, 1000)
  }

    /**
     * It is called only once, when the page is loaded.
     */
  initUsersPositions(){
    this.eventService.getLastPositions(this.eventId)
        .then((participantsProgress) => {
            this.lastUpdate = new Date();
            console.log("[Progress Management][OnInit][GetLastPositions][Success]", participantsProgress);
            this.initParticipantsMarkers(participantsProgress);
        }).catch((error)=> {
        console.log("[Progress Management][OnInit][GetLastPositions][Error]", error);
        //TODO: Show errors
    })
  }

  /**
   * It calls the event service in order to get the last positions of the users.
   */
  getLastPositions(){
    this.eventService.getLastPositions(this.eventId)
      .then((participantsProgress) => {
        this.lastUpdate = new Date()
        console.log("[Progress Management][OnInit][GetLastPositions][Success]", participantsProgress);
        this.transformParticipantsMaker(participantsProgress);
      }).catch((error)=> {
      console.log("[Progress Management][OnInit][GetLastPositions][Error]", error);
      //TODO: Show errors
    })
  }

  /**
   * It is called only once, when the page is loaded.
   * It initializes the markers of the participants.
   * @param participantsProgress
   */
  initParticipantsMarkers(participantsProgress){
    for (let i = 0; i < participantsProgress.length; i++) {
        this.participantsMarkers.push({
        lat: Number(participantsProgress[i].lastPosition.lat),
        lng: Number(participantsProgress[i].lastPosition.lng),
        timestamp: new Date(participantsProgress[i].lastPosition.timestamp),
        user: participantsProgress[i].userId,
        icon: "http://labs.google.com/ridefinder/images/mm_20_" +
        this.marker_background_colors[i % this.marker_background_colors.length] + ".png"
      });
    }
  }


  /**
   * It goes through the data received from the service and creates an array of markers.
   * @param participantsProgress
   */
  transformParticipantsMaker(participantsProgress){
    /*let tempParticipantsMarkers = [];
    for (let i = 0; i < participantsProgress.length; i++) {
        tempParticipantsMarkers.push({
        lat: Number(participantsProgress[i].lastPosition.lat),
        lng: Number(participantsProgress[i].lastPosition.lng),
        timestamp: new Date(participantsProgress[i].lastPosition.timestamp),
        user: participantsProgress[i].userId,
        icon: "http://labs.google.com/ridefinder/images/mm_20_" +
        this.marker_background_colors[i % this.marker_background_colors.length] + ".png"
      });
    }
    this.participantsMarkers = tempParticipantsMarkers;*/

    // iterate over the markers and update them with the new info
    for(let i = 0; i < this.participantsMarkers.length; i++){
        // update the single marker
        this.participantsMarkers[i]['lat'] = Number(participantsProgress[i].lastPosition.lat);
        this.participantsMarkers[i]['lng'] = Number(participantsProgress[i].lastPosition.lng);
        this.participantsMarkers[i]['timestamp'] = new Date(participantsProgress[i].lastPosition.timestamp);
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
      if(this.selectedType === 'waypoints'){
        this.getRoutePointsAndWaypoints();
      }else {
        this.recenterMap();
      }
    }
  }

  recenterMap(){
    this.initLat = this.mapPoints[this.mapPoints.length%2].lat;
    this.initLong = this.mapPoints[this.mapPoints.length%2].lng;
    this.zoom = 14;
    this.bounds = [{lat:this.mapPoints[0].lat , lng: this.mapPoints[0].lng, label:'A'},
      {lat:this.mapPoints[this.mapPoints.length - 1].lat, lng:this.mapPoints[this.mapPoints.length-1].lng, label: 'B'}];
    console.log("bounds: ", this.bounds)
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

  /**
   * Called when a participant is selected
   * @param event
   */
  onChange(event){
    var participant = event.target.value;
    if(participant != -1) {
      this.participantSelected = participant
    }else{
      this.participantSelected = ""
    }

    console.log('[EventProgressMap][onChange]', this.participantSelected)
  }
}

export interface Progress {
  lat?: Number;
  lng?: Number;
  timestamp?: Date;
  user: User;
  icon?: String;
}
