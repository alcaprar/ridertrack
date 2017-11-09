import { Injectable } from '@angular/core';

@Injectable()
export class UserService {

  private role;

  constructor() {
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
