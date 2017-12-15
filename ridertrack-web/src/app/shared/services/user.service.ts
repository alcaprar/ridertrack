import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { User } from '../models/user';
import {HttpClientService} from "./http-client.service";
import { AuthenticationService } from '../../authentication/authentication.service';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment'

@Injectable()
export class UserService {
  private BASE_USERS_URL = '/api/users/';

  constructor(private http: HttpClientService, private authService: AuthenticationService) {

  }

  /**
   * It returns the user detail.
   * If the user is not logged it returns null.
   * @returns {any}
   */
  getUser(): Observable<User> {
    let userId = this.authService.getUserId();
    console.log('[UserService][getUser]', userId);
    if (userId) {
      const url = `${this.BASE_USERS_URL}${userId}`;
      return this.http.get(url)
        .map(
        (response) => {
          console.log('[UserService][getUser][Success]', response.json());
          const userJson = response.json().user;
          // TODO create the user instance
          let user = new User(userJson.email, userJson.name, userJson.surname, '');
          user.id = userId;
          return user;
        },
        (error: any) => {
          console.log('[UserService][getUser][Error]', error);
          return Observable.of(null);
        });
    } else {
      return Observable.of(null);
    }
  }

  deleteUser() {
    let userId = this.authService.getUserId();
    console.log('[UserService][deleteUser]', userId);
    const url = `${this.BASE_USERS_URL}${userId}`;
    console.log(url);
    return this.http.delete(url).toPromise()
    .then((message) => {
      return message})
    .catch((error) => {
      console.log('[UserService][deleteUser][error]', error);
      return Promise.reject(error.message || error);
    });
  }


    
    /* .subscribe(
      (response) => {
        this.authService.logout();
        console.log('[UserService][deleteUser][Success]', response.json());
        const userJson = response.json();
        return userJson;
      },
      (error: any) => {
        console.log('[UserService][deleteUser][Error]', error);
        return Observable.of(null);
      });
  } */

}