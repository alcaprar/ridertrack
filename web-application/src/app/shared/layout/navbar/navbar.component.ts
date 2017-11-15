import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service';
import {AuthenticationService} from "../../../authentication/authentication.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private userService : UserService, private authService: AuthenticationService) {
    
  }

  ngOnInit() {
    
  }

  /**
   * It checks if the user is logged in the auth service.
   */
  isLoggedIn(): boolean{
    return this.authService.isAuthenticated()
  }

  logout(){
    this.authService.logout();
  }

}
