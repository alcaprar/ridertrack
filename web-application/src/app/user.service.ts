import { Injectable } from '@angular/core';

@Injectable()
export class UserService {

  private isUserLoggedIn;
  private role;

  constructor() {
    this.isUserLoggedIn=false;
    this.role="public";
  }

  setUserLoggedIn(){
    this.isUserLoggedIn=true;
  }

  setRole(login:String){
    this.role=login;
  }

  getRole(){
    return this.role;
  }

  getUserLoggedIn(){
    return this.isUserLoggedIn
  }

  isParticipant(){
    return this.role.equal("participant")
  }
  isOrganizer(){
    return this.role.equal("organizer")
  }

  logout(){
    this.isUserLoggedIn=false;
    this.role="public";
  }
}
