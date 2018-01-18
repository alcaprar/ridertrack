import {Directive, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {MapsAPILoader, GoogleMapsAPIWrapper} from "@agm/core";
import {} from "@types/googlemaps"

declare var google:any;

@Directive({
  selector: 'map-direction'
})
export class DirectionDirective implements  OnInit, OnChanges, OnDestroy {

  @Input() origin: any;
  @Input() destination: any;
  @Input() waypoints: any;
  @Input() display: boolean;
  @Output() lengthUpdated = new EventEmitter();

 travelMode: string = "WALKING";

  public directionService :any;
  public directionsDisplay: any = undefined;
  public length: number;

  constructor(private  googleWrapper : GoogleMapsAPIWrapper, private apiLoader: MapsAPILoader) {

  }

  ngOnInit(): void {
    this.length = 0;
    this.apiLoader.load().then(() => {
      this.directionService = new google.maps.DirectionsService;
      this.drawRoute();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.apiLoader.load().then(() => {
      this.directionService = new google.maps.DirectionsService;
      this.drawRoute();
    });
  }

  ngOnDestroy(): void {
    this.directionsDisplay.setMap(null);
    console.log("[Directions Directive][OnDestroy]")
  }


  drawRoute(){

    this.googleWrapper.getNativeMap().then(map => {

      this.length =0;//init

      if (typeof this.directionsDisplay === 'undefined') {
        this.directionsDisplay = new google.maps.DirectionsRenderer;
        this.directionsDisplay.setMap(map);
      }

      console.log("[MapsApiWrapper][directionService][Route]");
      this.directionService.route({
        origin:  this.origin,
        destination: this.destination,
        waypoints: this.waypoints,
        optimizeWaypoints: true,
        travelMode: this.travelMode
      }, (response, status) => {
        console.log("[Direction Service][Direction Sent][Response]", response);
        if (status === google.maps.DirectionsStatus.OK) {
          console.log("[Direction Service][Response][OK]");
          if(!this.display) {
            this.directionsDisplay.setOptions({preserveViewport: true});
          }
          this.directionsDisplay.setDirections(response);
          for(let i=0; i< response.routes[0].legs.length; i++){
            this.length += response.routes[0].legs[i].distance.value;
          }
          console.log("[DirectionService][TotalLength][Meters]" + this.length);
          //convert length in km
          this.length = this.length/1000;
          console.log("[DirectionService][TotalLength][KM]" + this.length);
          //emit length changed
          this.lengthUpdated.emit(this.length);

          //recenter the map to fit the route
          if(this.display) {
            let bounds = response.routes[0].bounds;

            map.fitBounds(bounds);
            map.setCenter(bounds.getCenter());
          }
      }
    })
    });
    }

}
