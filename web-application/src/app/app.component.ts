import { Component } from '@angular/core';
import {constructDependencies} from '@angular/core/src/di/reflective_provider';
import {UserService} from './shared/services/user.service';
declare var $:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(private auth: UserService) { }

  ngAfterViewInit(){
    $('#status').fadeOut(); // will first fade out the loading animation
    $('#preloader').delay(350).fadeOut('slow'); // will fade out the white DIV that covers the website.
    $('body').delay(350).css({'overflow': 'visible'});
  }
}

