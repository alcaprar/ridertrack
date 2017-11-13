import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  loggedIn: boolean;

  constructor(private user : UserService) {
    this.loggedIn=user.isLoggedIn();
  }

  ngOnInit() {
    console.log(this.user.isLoggedIn());
  }


}
