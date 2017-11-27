import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
declare var $: any;


@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MyEventsComponent implements OnInit {

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    console.log('[MyEvents][onInit]',this.route.children)
  }
}
