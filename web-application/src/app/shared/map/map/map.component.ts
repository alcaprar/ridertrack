import { Component, OnInit, Input } from '@angular/core';
import {Event} from '../../models/event';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  @Input() currentEvent: Event;
  routes: [[String, String]];

  constructor() {
  }

  ngOnInit() {
 this.routes = this.currentEvent.routes;
  }

}
