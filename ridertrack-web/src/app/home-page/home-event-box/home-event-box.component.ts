import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-home-event-box',
  templateUrl: './home-event-box.component.html',
  styleUrls: ['./home-event-box.component.css']
})
export class HomeEventBoxComponent implements OnInit {

  @Input()
  event: any;

  constructor() { }

  ngOnInit() {
  }

}
