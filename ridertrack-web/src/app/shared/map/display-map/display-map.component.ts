import {Component, NgZone, OnInit, Input, AfterContentInit} from '@angular/core';
import {GoogleMapsAPIWrapper, MapsAPILoader} from "@agm/core";
import {RouteService} from "../../services/route.service";
import {Event} from "../../models/event";
import {} from '@types/googlemaps';

declare var google:any;
declare var $:any;

@Component({
  selector: 'app-display-map',
  templateUrl: './display-map.component.html',
  styleUrls: ['./display-map.component.css']
})
export class DisplayMapComponent implements OnInit{


  @Input() event: Event;
  @Input() eventid: string;

  public initCoords: any;
  public origin:any;
  public destination:any;
  public zoom = 15;
  public lat: number;
  public lng: number;
  public selected: String = '';

  public bounds: any;

  public mapPoints; //latLng array
  directions: any;
  constructor(private mapsAPILoader: MapsAPILoader, private ngZone: NgZone, private routeService: RouteService,
              private googleWrapper: GoogleMapsAPIWrapper) { }

  ngOnInit() {

      this.routeService.getRoute(this.eventid)
        .then(
          (route) => {
            console.log('[DisplayMap][OnInit][success]', route);
            this.mapPoints = route.coordinates as [{lat: number, lng: number}];
            this.selected = route.type;
            console.log('[DisplayMap][OnInit][Coordinates detected]', this.mapPoints);
            console.log('[DisplayMap][OnInit][Type Detected]', this.selected);
            this.initMap();
          })
        .catch((err) => {
          console.log('[DisplayMap][OnInit][error]', err);
        });
    }


  initMap() {

    if (this.mapPoints.length > 0) {
      console.log('[Display Map][Route exists]');
      this.initCoords ={lat: this.mapPoints[0].lat, lng: this.mapPoints[0].lng } ;
      this.origin = this.initCoords;
      this.destination = this.mapPoints[this.mapPoints.length - 1];
      if(this.selected === 'waypoints'){
        this.getRoutePointsAndWaypoints();
      }else{
        this.recenterMap();
      }
    }
  }

  recenterMap(){
    this.initCoords = this.mapPoints[this.mapPoints.length%2];
    this.zoom = 14;
    this.bounds = [{lat:this.mapPoints[0].lat , lng: this.mapPoints[0].lng, label:'A'},
      {lat:this.mapPoints[this.mapPoints.length - 1].lat, lng:this.mapPoints[this.mapPoints.length-1].lng, label: 'B'}];
    console.log("bounds: ", this.bounds);
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
