import {Component, OnInit, Input, ViewChild, ElementRef} from '@angular/core';
import {Event} from '../../models/event';
import {} from '@agm/core';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  @Input() currentEvent: Event;
  public routes: [[Number, Number]];

  public initLat: Number;
  public initLong: Number;


  constructor() {
  }

  ngOnInit() {
    this.getRoutes();
    this.initializeMap();
  }

  initializeMap(){
    this.initLat = this.routes[1][0];
    this.initLong = this.routes [1][1];
  }

  getRoutes() {
    if (this.currentEvent == null) {
      this.routes = [[0, 0]];
    } else {
      this.routes = this.currentEvent.routes;
      console.log('[MapComponent][getRoutes][routes]', this.routes);
    }
  }


}
