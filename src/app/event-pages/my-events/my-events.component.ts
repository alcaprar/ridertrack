import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';


@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.css'],
})
export class MyEventsComponent implements OnInit {


  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {

  }

  /**
   * It is called when the user clicks the button.
   */
  public createEvent(){
    this.router.navigate(['/events', 'create'])
  }


}
