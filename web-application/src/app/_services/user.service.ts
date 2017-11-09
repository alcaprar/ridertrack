import { Injectable } from '@angular/core';
import {AuthenticationService} from "./authentication.service";
import {Http} from "@angular/http";

@Injectable()
export class UserService {

  private role;

  constructor(private http: Http,
              private authenticationService: AuthenticationService) {
    this.role = '';
  }

  setRole(login: String) {
    this.role = login;
  }

  getRole() {
    return this.role;
  }

  isLoggedIn() {
    return this.role !== '';
  }

  isParticipant() {
    return this.role.equal('participant');
  }
  isOrganizer() {
    return this.role.equal('participant');
  }

  logout() {
    this.role = '';
  }
}
