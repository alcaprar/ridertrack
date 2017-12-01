import {AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {FormControl} from "@angular/forms";
import {GoogleMapsAPIWrapper, MapsAPILoader, MouseEvent as AGMMouseEvent} from "@agm/core";

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
    public markers = []; //latLng array

    directions : any;
    public directionService;
    public directionDisplay;

    @ViewChild("search")
    public searchElementRef: ElementRef;

    constructor(private mapsAPILoader: MapsAPILoader, private ngZone: NgZone, private googleWrapper: GoogleMapsAPIWrapper) {}

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
            this.directionDisplay = new google.maps.DirectionsService;
            this.directionService= new google.maps.DirectionsRenderer;
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
        this.markers.push(currentpoint);
        console.log("[Map][Clicked][Marker added]", this.markers);
        this.mapPoints.push(currentpoint);
        this.getRoutePointsAndWaypoints();
    }


    getRoutePointsAndWaypoints(){
        let waypoints = new Array();
        if (this.mapPoints.length > 2){
            for(let i=1; i<this.mapPoints.length-1; i++){
                let address = this.mapPoints[i];
                if(address !== ""){
                    waypoints.push({
                        location: address,
                        stopover: true //show marker on map for each waypoint
                    });
                }
                this.drawRoute(this.mapPoints[0], this.mapPoints[this.mapPoints.length-1],waypoints);
            }
        }else if(this.mapPoints.length > 1){
            this.drawRoute(this.mapPoints[this.mapPoints.length-2], this.mapPoints[this.mapPoints.length-1], waypoints);
        }else {
            this.drawRoute(this.mapPoints[this.mapPoints.length-1], this.mapPoints[this.mapPoints.length -1 ], waypoints);
        }
    }

    drawRoute(originAddress, destinationAddress, waypoints){
        this.directions = {
            origin: {lat: originAddress.lat, lng: originAddress.lng},
            destination: {lat: destinationAddress.lat, lng: destinationAddress.lng},
            waypoints: waypoints
        };
        console.log("[Directions][Update]", this.directions);
        // Send request
        this.googleWrapper.getNativeMap().then(map => {

            if (typeof this.directionDisplay === 'undefined') {
                console.log("[MapsApiWrapper][directionDisplay][Undefined]");
                this.directionDisplay = new google.maps.DirectionsRenderer;
            }
            this.directionDisplay.setMap(map);
            console.log("[MapsApiWrapper][directionService][Route]");
            this.directionService.route({
                origin: this.directions.origin,
                destination: this.directions.destination,
                waypoints: this.directions.waypoints,
                travelMode: google.maps.TravelMode.WALKING
            }, (response, status) => {
                console.log("[Direction Service][Direction Sent][Response]", response);
                if (status === google.maps.DirectionsStatus.OK) {
                    console.log("[Direction Service][Response][OK]");
                    this.directionDisplay.setDirections(response);
                }
            } );

        });
    }

    saveRoute() {

    }

}
