import {Component, Input, OnInit} from '@angular/core';
import {EventService} from "../../services/event.service";
import {Event} from '../../models/event'
declare var $:any;

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  private lastEvents: Event[];

  constructor(private eventService: EventService) {
    // retrive the last 3 events
    this.eventService.getLastEvents(3)
      .then(
        (events) =>{
          console.log('[Footer][getLastEvents][success]', events);
          this.lastEvents = events
        }
      )
      .catch(
        (error) =>{
          console.log('[Footer][getLastEvents][error]', error);
        }
      )
  }

  ngOnInit() {
  }

  thisYear(){
    return (new Date()).getFullYear()
  }

}
