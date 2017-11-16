import { Injectable } from '@angular/core';
import {AuthenticationService} from '../../authentication/authentication.service';
import {Http} from '@angular/http';
import {User} from '../models/user';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class UserService {

  private isLogged: boolean;
  users: User[];
  currentUser: User;

  private BASE_AUTH_URL = 'http://localhost:5000/api';

  constructor(private http: Http,
              private authenticationService: AuthenticationService) {
   this.isLogged = false;
  }

  /**
   *  get the list of all users calling the associated api in the server
   * @returns {Subscription}
   */
  getUsers(): Promise<any> {
    const url = `${this.BASE_AUTH_URL}/users`;
    return new Promise ((resolve, reject) => {
      this.http.get(url)
        .map(res => res.json())
        .subscribe(res => {
          console.log('[UserService][getUsers][success]', res);
          const body = res.json();
          return body.user;
        }, err => {
          console.log('[getUsers][error]', err);
          reject(err);
          return Promise.reject(err || err.message);
        });
    });
  }

  getUserById(id): Promise<any> {
    const url = `${this.BASE_AUTH_URL}/users/`;
    return this.http.get(url + id).toPromise()
      .then(res => {
        console.log('[UserService][getUserId][Success]', id);
        const body = res.json();
        return body.user;
      }, err => {
        console.log('[UserService][getUserId][Error]', err);
        return Promise.reject(err || err.message);
      });
  }


  setLogin() {
    this.isLogged = true;
  }

  isLoggedIn() {
    return this.isLogged;
  }

  setLogout() {
    this.isLogged = false;
  }
}
