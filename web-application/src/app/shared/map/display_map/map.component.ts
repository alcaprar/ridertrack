import {Component, OnInit, Input} from '@angular/core';
import {Event} from '../../models/event';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  @Input() currentEvent: Event;
  public routes: any = null;

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
      this.routes = null;
    } else {
      this.routes = this.currentEvent.routes;
      console.log('[MapComponent][getRoutes][routes]', this.routes);
    }
  }


}
