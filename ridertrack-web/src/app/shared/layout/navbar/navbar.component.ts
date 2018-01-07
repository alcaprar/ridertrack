import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service';
import {AuthenticationService} from '../../../authentication/authentication.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  profilePictureURL: String;
  public isAdmin: boolean;
  private user: User = new User();
  private role: String;

  constructor(private userService: UserService, private authService: AuthenticationService) {
  }

  ngOnInit() {
    this.isAdministrator();

  }

  /**
   * It checks if the user is logged in the auth service.
   */
  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  logout( ) {
    this.isAdmin = false;
    this.authService.logout();
  }

  isAdministrator() {
    this.role = this.authService.getUserRole();
    console.log('[Navbar][getRole]'+this.role);
    if(this.role === "administrator"){
      return true;
    } else {
      return false;
    }
  }

}
