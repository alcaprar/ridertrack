import { Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import { MapsAPILoader, MouseEvent as AGMMouseEvent} from "@agm/core";
import {} from '@types/googlemaps';
import {FormControl} from "@angular/forms";

declare var google: any;

@Component({
    selector: 'app-add-route-map',
    templateUrl: './add-route-map.component.html',
    styleUrls: ['./add-route-map.component.css']
})
export class AddRouteMapComponent implements OnInit {

    public initLat: number;
    public initLong: number;
    public zoom = 15;
    public searchControl: FormControl= new FormControl();

    public mapPoints = []; //latLng array
    directions : any;
    travelModeInput: string = 'WALKING';

    @ViewChild("search")
    public searchElementRef: ElementRef;

    constructor(private mapsAPILoader: MapsAPILoader, private ngZone: NgZone) {}

    ngOnInit() {
        this.initMap();
    }

    initMap(){

        //set up current location
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(position => {
                this.initLat = position.coords.latitude;
                this.initLong = position.coords.longitude;
                console.log("[Geolocated]", position.coords);
            });
        }

        //add listener to Input search
        this.mapsAPILoader.load().then(()=> {
            let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
                types: ["address"]
            });
            autocomplete.addListener("place_changed", () => {
                this.ngZone.run(() => {
                    let place: google.maps.places.PlaceResult = autocomplete.getPlace();

                    if(place.geometry === undefined || place.geometry === null) {
                        return;
                    }
                    this.initLat= place.geometry.location.lat();
                    this.initLong= place.geometry.location.lng();
                    this.zoom = 15;

                    console.log("[Show area inserted]" + "[Lng]" +this.initLong + "[Lat]"+ this.initLong);
                })
            })
        });
    }


    mapClicked($event : AGMMouseEvent){

        let currentpoint = $event.coords; //latLng literal coords
        console.log("[Map][Clicked][Coordinates detected]", currentpoint);
        this.mapPoints.push(currentpoint);
        this.initLat= this.mapPoints[this.mapPoints.length-1].lat;
        this.initLong = this.mapPoints[this.mapPoints.length-1].lng;
        this.getRoutePointsAndWaypoints();
    }

    getRoutePointsAndWaypoints(){
        let waypoints = [];

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

    setTravelMode(value: string) {
      this.travelModeInput = value;
    }

    clearAll() {
      this.mapPoints = [];
      this.directions = null;
    }

    clearLast() {
      if(this.mapPoints.length> 1){
        this.mapPoints.pop();
        this.getRoutePointsAndWaypoints();
      } else {
          this.clearAll();
        }
    }

    saveRoute(){

    }

}
