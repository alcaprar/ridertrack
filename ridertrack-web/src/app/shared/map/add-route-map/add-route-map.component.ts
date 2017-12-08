import { Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import { MapsAPILoader, MouseEvent as AGMMouseEvent} from "@agm/core";
import {} from '@types/googlemaps';
import {FormControl} from "@angular/forms";
import {RouteService} from "../../services/route.service";
import {ActivatedRoute, Router} from "@angular/router";
import {isNullOrUndefined} from "util";

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

    public mapPoints : any = [] ; //latLng array
    directions : any;
    travelModeInput: string = 'WALKING';

    private eventId: String;

    @ViewChild("search")
    public searchElementRef: ElementRef;

    constructor(private mapsAPILoader: MapsAPILoader, private ngZone: NgZone, private routeService: RouteService,
                private route: ActivatedRoute, private router: Router) {}

    ngOnInit() {
      this.route.params.subscribe(params => {
        this.eventId = params['eventId'];
        console.log('[Route Management][OnInit]', this.eventId);
      });

      this.routeService.getRoute(this.eventId)
        .then(
          (coordinates) => {
            console.log('[Route Management][OnInit][success]', coordinates);
            if(coordinates === null || coordinates === undefined){
              this.mapPoints = [];
            } else {
              console.log('[Route Management][OnInit][Coordinates detected]', coordinates);
              this.mapPoints = coordinates;
              this.initLat = this.mapPoints[0].lat;
              this.initLong = this.mapPoints[0].lng;
              this.getRoutePointsAndWaypoints();
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

    initMap(){

        //set up current location
        if( navigator.geolocation && this.mapPoints === []){
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
                    this.zoom = 17;

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

  /**
   * It is called when the user click the save route button.
   * It then calls the routeService to update the route passing the points.
   */
    saveRoute(){
      this.routeService.updateRoute(this.eventId, this.mapPoints);

      // TODO use the dialog service to show the result of the saving
    }

}
