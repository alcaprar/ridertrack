import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClientService } from "./http-client.service";
import { AuthenticationService } from '../../authentication/authentication.service';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Error } from "../models/error";

@Injectable()
export class UserService {
  private BASE_USERS_URL = '/api/users/';
  private BASE_AUTH_URL = '/api/auth';

  constructor(private http: HttpClientService, private authService: AuthenticationService, private router: Router) {

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
          if(userJson.city === 'undefined'){
            user.city = '';
          }else {
            user.city = userJson.city;
          }
          if(userJson.aboutMe === 'undefined'){
            user.aboutMe = '';
          }else {
            user.aboutMe = userJson.aboutMe;
          }
          user.logo = userJson.logo;
          user.role = userJson.role;
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

  getUserById(userId){
    const url = `${this.BASE_USERS_URL}${userId}`;
    return this.http.get(url)
      .map(
        (response) => {
          console.log('[UserService][getUser][Success]', response.json());
          const userJson = response.json().user;
          let user = new User(userJson.email, userJson.name, userJson.surname, '');
          user.id = userId;
          if(userJson.city === 'undefined'){
            user.city = '';
          }else {
            user.city = userJson.city;
          }
          if(userJson.aboutMe === 'undefined'){
            user.aboutMe = '';
          }else {
            user.aboutMe = userJson.aboutMe;
          }
          user.logo = userJson.logo;
          user.role = userJson.role;

          return user;
        },
        (error: any) => {
          console.log('[UserService][getUser][Error]', error);
          return Observable.of(null);
        });
  }


  /**
  * It returns all the users.
  * @returns {any}
  */

  getAllUsers() {
    const url = `${this.BASE_USERS_URL}`;
    console.log('[UserService][getAllUsers]', url);
    return this.http.get(url).toPromise()
      .then((response) => {
        const body = response.json();
        const users = body.users as User[];
        console.log('[UserService][getAllUsers][success]', body);
        return users;
      }, (err) => {
        console.log('[UserService][getAllUsers][error]', err);
        return null;
      });
  }

  /**
   * It calls the endpoint for deleting the user.
   * If the user is successfully deleted, it logout and navigate to the home.
   * If is not deleted it returns a list of errors.
   * @returns {any|Promise<Error[]>|Promise<T>}
     */
  deleteUser(): Promise<Error> {
    let userId = this.authService.getUserId();
    console.log('[UserService][deleteUser]', userId);
    const url = `${this.BASE_USERS_URL}${userId}`;
    console.log(url);
    return this.http.delete(url).toPromise()
      .then(
      (response) => {
        console.log('[UserService][deleteUser][then]', response);
        this.authService.logout();
        this.router.navigate(['']);
        return null
      })
      .catch(
      (errorResponse: any) => {
        var errors = errorResponse.json() as Error[];
        console.log('[UserService][deleteUser][error]', errors);
        return errors
      });
  }

  deleteUserById(userId): Promise<Error> {
    const url = `${this.BASE_USERS_URL}${userId}`;
    console.log('[UserService][deleteUserById]',userId);
    console.log(url);
    return this.http.delete(url).toPromise()
      .then(
        (response) => {
          console.log('[UserService][deleteUser][then]', response);
          this.authService.logout();
          this.router.navigate(['']);
          return null
        })
      .catch(
        (errorResponse: any) => {
          var errors = errorResponse.json().errors as Error[];
          console.log('[UserService][deleteUser][error]', errors);
          return errors;
        });
  }

  updateCurrentUser(user): Promise<any> {
    let userId = this.authService.getUserId();
    console.log('[UserService][UpdateCurrentUser]', userId);

    const url = `${this.BASE_USERS_URL}${userId}`;

    var formData = new FormData();
    formData.append('logo', user.logo);
    formData.append('name', user.name);
    formData.append('surname', user.surname);
    formData.append('city', user.city);
    formData.append('aboutMe', user.aboutMe);
    formData.append('email', user.email);
    formData.append('password', user.password);

    return new Promise((resolve,reject)=> {
      this.http.put(url, formData).toPromise()
        .then((response)=> {
          let body = response.json();
          console.log("[UserService][UpdateCurrentUser][Success]", body.user);
          return resolve([body.user as User]);
        }).catch((error)=> {
        let body = error.json();
        console.log("[UserService][UpdateCurrentUser][Error]",body);
        return reject([body.errors as Error[]]);
      });
    });
  }

  updateUserById(userId, user){
    const url = `${this.BASE_USERS_URL}${userId}`;
    var formData = new FormData();
    formData.append('logo', user.logo);
    formData.append('name', user.name);
    formData.append('surname', user.surname);
    formData.append('city', user.city);
    formData.append('aboutMe', user.aboutMe);
    formData.append('email', user.email);
    formData.append('password', user.password);

    return this.http.put(url, formData).toPromise()
      .then((response)=> {
        let body = response.json();
        console.log("[UserService][UpdateUserById][Success]", body.user);
        let user = body.user as User;
        return user;
      }).catch((error)=> {
        let body = error.json();
        console.log("[UserService][UpdateUserById][Error]", error);
        let errors = body.errors;
        return errors;
      })
  }

}
