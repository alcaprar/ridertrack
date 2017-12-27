import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {EventService} from "../../shared/services";


@Component({
  selector: 'app-event-progress',
  templateUrl: './event-progress.component.html',
  styleUrls: ['./event-progress.component.css']
})
export class EventProgressComponent implements OnInit {

  private eventId;
  private eventName = '';
  constructor(private router: Router, private eventService: EventService, private route: ActivatedRoute){}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.eventId = params['eventId'];
      this.eventService.getEvent(this.eventId)
        .then(
          (event) => {
            console.log('[EventProgress][OnInit]', this.eventId, event);
            this.eventName = event.name;
          });
    });
  }
}
