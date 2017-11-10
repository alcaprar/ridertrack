import { Injectable } from '@angular/core';
import {AuthenticationService} from "./authentication.service";
import {Http} from "@angular/http";
import {User} from "../_models/user";

@Injectable()
export class UserService {

  private isLogged: boolean;

  constructor(private http: Http,
              private authenticationService: AuthenticationService) {
   this.isLogged=false;
  }

  setLogin(){
    this.isLogged=true;
  }

  isLoggedIn() {
    return this.isLogged;
  }

  setLogout() {
    this.isLogged=false;
  }
}
