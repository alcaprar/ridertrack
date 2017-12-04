import {Directive, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {GoogleMapsAPIWrapper} from "@agm/core";
import {} from "@types/googlemaps"

declare var google:any;

@Directive({
  selector: 'map-direction'
})
export class DirectionDirective implements  OnInit, OnChanges, OnDestroy {

  @Input() origin: any;
  @Input() destination: any;
  @Input() waypoints: any;
  @Input() travelMode: string;

  public directionService = new google.maps.DirectionsService;
  public directionsDisplay: any = undefined;

  constructor(private  googleWrapper : GoogleMapsAPIWrapper) { }

  ngOnInit(): void {
      this.drawRoute();
  }

  ngOnChanges(changes: SimpleChanges): void {
      this.drawRoute();
  }

  ngOnDestroy(): void {
    this.directionsDisplay.setMap(null);
    console.log("[Directions Directive][OnDestroy]")
  }


  drawRoute(){

    this.googleWrapper.getNativeMap().then(map => {

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
          this.directionsDisplay.setDirections(response);
        }
      } );

    });
  }


}
