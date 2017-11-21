import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-event-box',
  templateUrl: './event-box.component.html',
  styleUrls: ['./event-box.component.css']
})
export class EventBoxComponent implements OnInit {

  @Input()
  event: any;

  constructor() { }

  ngOnInit() {
    console.log('[EventBox][Init]', this.event)
  }
}
