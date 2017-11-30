import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-footer-event-box',
  templateUrl: './footer-event-box.component.html',
  styleUrls: ['./footer-event-box.component.css']
})
export class FooterEventBoxComponent implements OnInit {

  @Input()
  event: any;

  constructor() { }

  ngOnInit() {
    console.log('[FooterEventBox][Init]', this.event)
  }
}
