import { Component, OnInit, Input } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-event-box-organized',
  templateUrl: './event-box-organized.component.html',
  styleUrls: ['./event-box.component.css']
})
export class EventBoxOrganizedComponent implements OnInit {

  @Input()
  event: any;

  constructor(private router: Router) { }

  ngOnInit() {
    console.log('[EventBox][Init]', this.event)
  }
}
