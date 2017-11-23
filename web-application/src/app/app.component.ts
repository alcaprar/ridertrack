import { Component } from '@angular/core';
import {constructDependencies} from '@angular/core/src/di/reflective_provider';
import {UserService} from './shared/services/user.service';
import { Router, NavigationEnd } from '@angular/router';
declare var $:any;
declare var WOW: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(private router: Router) { }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
  }

  ngAfterViewInit(){
    $('#status').fadeOut(); // will first fade out the loading animation
    $('#preloader').delay(350).fadeOut('slow'); // will fade out the white DIV that covers the website.
    $('body').delay(350).css({'overflow': 'visible'});

    // init wow for animation
    new WOW().init();
  }
}

