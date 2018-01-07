import {Component, ElementRef, NgZone, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { MapsAPILoader, MouseEvent as AGMMouseEvent} from "@agm/core";
import {} from '@types/googlemaps';
import {RouteService} from "../../services/route.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DialogService} from "../../dialog/dialog.service";
import {Event} from "../../models";
import {EventService} from "../../services";

declare var google: any;
declare var $: any;

@Component({
  selector: 'app-add-route-map',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './add-route-map.component.html',
  styleUrls: ['./add-route-map.component.css']
})
export class AddRouteMapComponent implements OnInit {

  public initLat: number;
  public initLong: number;
  public zoom = 15;
  public selected: String = '';
  public event = new Event();

  public mapPoints : any = [] ; //latLng array
  directions : any;
  private length: number;

  public userSettingCity: any = {
    showSearchButton: false,
    geoTypes: ['address'],
    showCurrentLocation: false,
    inputPlaceholderText: 'Insert a Starting Address'
  };

  private eventId: String;

  errors: Error[] = [];

  @ViewChild("search")
  public searchElementRef: ElementRef;

  constructor(private mapsAPILoader: MapsAPILoader, private ngZone: NgZone, private routeService: RouteService,
              private route: ActivatedRoute, private router: Router, private dialogService: DialogService,
              private eventService: EventService) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.eventId = params['eventId'];
      console.log('[Route Management][OnInit]', this.eventId);
    });

    this.eventService.getEvent(this.eventId).then((event) => {
      this.event = event;
      console.log('[Route Management][OnInit][Event detected]', event);
    });

    this.routeService.getRoute(this.eventId)
      .then(
        (route) => {
          console.log('[Route Management][OnInit][success]', route);
          this.mapPoints = route.coordinates as [{lat: number, lng: number}];
          this.selected = route.type;
          console.log('[Route Management][OnInit][Coordinates detected]', this.mapPoints);
          console.log('[Route Management][OnInit][Type Detected]', this.selected);
          this.initMap();
        }
      )
      .catch(
        (error) => {
          console.log('[Route Management][OnInit][error]', error);
          this.errors = error;
        }
      );

  }

  initMap(){

    //set up current location
    if(this.mapPoints.length > 0){
      this.initLat = this.mapPoints[0].lat;
      this.initLong = this.mapPoints[0].lng;
      if(this.selected === 'waypoints'){
        this.getRoutePointsAndWaypoints();
      }
    } else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          this.initLat = position.coords.latitude;
          this.initLong = position.coords.longitude;
          console.log("[Geolocated]", position.coords);
        });
      }
    }
  }

  autocompleteAddress(selectedData: any){
    console.log(selectedData);
    this.initLat = selectedData.data.geometry.location.lat;
    this.initLong = selectedData.data.geometry.location.lng;
    this.zoom = 17;
  }


  mapClicked($event : AGMMouseEvent){

    if(this.selected === ''){
      this.dialogService.alert("Error", "You have to select a method to start draw the route !!!")
    }else {
      let currentpoint = $event.coords; //latLng literal coords
      console.log("[Map][Clicked][Coordinates detected]", currentpoint);
      this.mapPoints.push(currentpoint);
      this.initLat = this.mapPoints[this.mapPoints.length - 1].lat;
      this.initLong = this.mapPoints[this.mapPoints.length - 1].lng;
      this.calculateTotalLength();
      if (this.selected === 'waypoints') {
        this.getRoutePointsAndWaypoints();
      }
    }
  }

  setRadio(value: String){
    this.selected = value;
    this.clearAll();
    console.log("[EditRoute][Selection]"+ this.selected);
  }

  getRoutePointsAndWaypoints(){
    let waypoints = [];
    if(this.mapPoints.length > 25){
      this.dialogService.alert("Error", "The maximum number of checkpoints is 23! If you want more than you can use 'Lines'.");
      return;
    }
    if (this.mapPoints.length > 2){
      for(let i=1; i<this.mapPoints.length-1; i++){
        let address = this.mapPoints[i];
        if(address !== ""){
          waypoints.push({
            location: address,
            stopover: true //show marker on map for each waypoint
          });
        }
        this.updateDirections(this.mapPoints[0], this.mapPoints[this.mapPoints.length-1],waypoints);
      }
    }else if(this.mapPoints.length > 1){
      this.updateDirections(this.mapPoints[this.mapPoints.length-2], this.mapPoints[this.mapPoints.length-1], waypoints);
    }else {
      this.updateDirections(this.mapPoints[this.mapPoints.length-1], this.mapPoints[this.mapPoints.length -1 ], waypoints);
    }
  }

  updateDirections(originAddress, destinationAddress, waypoints){
    this.directions = {
      origin: {lat: originAddress.lat, lng: originAddress.lng},
      destination: {lat: destinationAddress.lat, lng: destinationAddress.lng},
      waypoints: waypoints
    };
    console.log("[Directions][Update]", this.directions);
  }

  /**
   * It removes all the map points.
   */
  clearAll() {
    this.mapPoints = [];
    this.directions = null;
    this.length = null;
  }

  /**
   * It removes the last inserted map point.
   */
  clearLast() {
    if(this.mapPoints.length> 1){
      this.mapPoints.pop();
      this.calculateTotalLength();
      if(this.selected ==="waypoints"){
        this.getRoutePointsAndWaypoints();
      }
    } else {
      this.clearAll();
    }
  }

  /**
   * It is called when the user click the save route button.
   * It then calls the routeService to update the route passing the points.
   */
  saveRoute(){
    this.calculateTotalLength();
    this.routeService.updateRoute(this.eventId, this.mapPoints, this.selected, this.length).then(()=> {
      this.dialogService.alert("Route", " The route has correctly been saved.");
      this.router.navigate(['/events', this.eventId, 'manage']);
    }).catch((err) => {
      this.errors = err;
    });
  }

  /**
   * Calculates the total length in case of polylines
   */
  calculateTotalLength() {
    if(this.selected ==='polylines'){
      this.length =0;
      for(let i=0,j=1; i<this.mapPoints.length-1,j<this.mapPoints.length;i++,j++){
        let totalRadius = 6371;
        let dLat = (this.mapPoints[j].lat - this.mapPoints[i].lat)*(Math.PI/180);
        let dLng = (this.mapPoints[j].lng - this.mapPoints[i].lng)*(Math.PI/180);
        let a = Math.sin(dLat/2)*Math.sin(dLat/2) + Math.cos(this.mapPoints[i].lat * Math.PI/180)*
          Math.cos(this.mapPoints[j].lat*Math.PI/180)* Math.sin(dLng/2)*Math.sin(dLng/2);
        let c = 2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        let distance = totalRadius*c;
        this.length += distance;
      }
      this.length = Number(this.length.toFixed(3));
      console.log("[Polylines][getTotalLength]", this.length);
    }
  }

  /**
   * Calculates the total length in case of waypoints.
   * @param length
     */
  handleLengthUpdated(length){
    this.length = length;
    console.log("[Directions][handleLengthUpdated]", length);
  }
}
