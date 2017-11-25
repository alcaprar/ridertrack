import { Injectable, ApplicationRef  } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';
import { FacebookService, InitParams, LoginResponse,LoginOptions} from 'ngx-facebook';
import { Router } from '@angular/router';
import { User } from '../shared/models/user';
import {Error} from '../shared/models/error';
import 'rxjs/add/operator/catch.js';
import 'rxjs/Rx';
import * as jwt_decode from 'jwt-decode';
import {environment} from '../../environments/environment'

declare const gapi: any;

export const TOKEN = 'TOKEN';
export const USERID = 'USERID';
export const ROLE = 'ROLE';

@Injectable()
export class AuthenticationService{
  private BASE_AUTH_URL = environment.baseAPI + '/auth';

  public auth2: any;

  private gapiPromise: any;

  constructor(private http: Http, private fb: FacebookService, private router: Router, private appRef: ApplicationRef) {
    console.log('[AuthService]', environment)
    // check the token stored in localStorage
    this.isAuthenticated();

    // init Facebook strategy
    const initParams: InitParams = {
      appId: '278876872621248',
      xfbml: true,
      version: 'v2.11'
    };
    fb.init(initParams);

    this.gapiPromise = new Promise((resolve, reject) => {
      gapi.load('auth2',  () => {
        this.auth2 = gapi.auth2.init({
          client_id: '909431710947-moe1csc5e564mo5qn8mmtc13thmmjj2e.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
          scope: 'profile email'
        });
        resolve();
      });
    });
  }

  /**
   * It attached a listener to the google button.
   * When the button is clicked it calls the google api.
   * When it receives the token from the google api it sends it to the webserver and waits for a jwt token.
   */
  attachGoogleSignIn(element, showErrorCallback){
    this.gapiPromise.then(
      data => {
        this.auth2.attachClickHandler(element, {},
          (response) => {
            console.log('[AuthService][Google login][success]', response.getAuthResponse().access_token);
            const url = `${this.BASE_AUTH_URL}/login/google?access_token=${response.getAuthResponse().access_token}`;
            this.http.get(url).toPromise()
              .then(
                (response) => {
                  console.log('[AuthS][Google login][success]', data);
                  // the google token was successfully received by the web server
                  // and it has sent a jwt token
                  const body = response.json();
                  this.storeResponse(body.userId, body.role, body.jwtToken);

                  // route to my-events
                  this.router.navigate(['my-events']);

                  // to force angular to update the views
                  this.appRef.tick();
                },
                (errorResponse) => {
                  // something went wrong with the sending of the google token
                  var errors = errorResponse.json().errors as Error[];
                  console.log('[AuthS][Google login][error]', errors);

                  showErrorCallback(errors);
                }
              );

          },
          (error) => {
            console.log('[AuthService][Google login][error]', error);
          }
        );
      }
    );

  }

  /**
   * It calls the api passing email and password.
   * If the credentials are valid it stores the received token in localStorage and return true.
   * If they are invalid, it returns false.
   */
  login(user: User): Promise<Error[]> {
    console.log('[AuthS][ClassicalLogin]');
    const url = `${this.BASE_AUTH_URL}/login`;
    return this.http.post(url, {email: user.email, password: user.password}).toPromise()
      .then(
        (response: Response) => {
          console.log('[AuthS][ClassicalLogin][success]', response.json());

          const body = response.json();

          this.storeResponse(body.userId, body.role, body.jwtToken);

          // route to my-events
          this.router.navigate(['my-events']);

          return null;
        },
        (errorResponse: any) => {
          var errors = errorResponse.json().errors as Error[];
          console.log('[AuthS][ClassicalLogin][error]', errors);
          return errors;
        }
      )
  }

  /**
   * It sends a post to the web server with the user details.
   * If the registration is successfull it receives also a token and redirects to the private page.
   * @param user
   * @returns {any|Promise<R>|Promise<T>|Maybe<T>}
   */
  register(user: User): Observable<boolean> {
    const url = `${this.BASE_AUTH_URL}/register`;
    return this.http.post(url, {name: user.name, surname: user.surname, email: user.email, password: user.password})
      .map(
        (response: Response) => {
          console.log('[AuthS][Register][success]', response);
          // the registration succedeed
          const body = response.json();

          this.storeResponse(body.userId, body.role, body.jwtToken);

          // route to my-events
          this.router.navigate(['my-events']);

          return true;
        }
      )
      .catch(
        (error: any) => {
          console.log('[AuthS][Registration][error]', error.json());
          return Observable.of(false);
        }
      );
  }

  /**
   * It calls the method login of the Facebook SDK and wait for results.
   * If the login is successful it sends the received token to the web server to get a JWT token
   */
  loginWithFacebook(){
    console.log('[AuthS][FB]');
    const options: LoginOptions = {
      auth_type: 'rerequest', // it should re request the permissions that the user did not granted
      scope: 'public_profile,email',
      return_scopes: true
    };
    // call the login method of Facebook SDK
    this.fb.login(options)
      .then((response: LoginResponse) => {
        // check if he/she gave enough permissions

        var grantedPermissions = response.authResponse.grantedScopes.split(',');

        if(grantedPermissions.indexOf('email') > -1 && grantedPermissions.indexOf('public_profile') > -1){
          // the user has granted enough permission

          // facebook login is successful and returned a token
          // we send this token to our web server
          console.log('[AuthS][FB][success]', response);
          const url = `${this.BASE_AUTH_URL}/login/facebook?access_token=${response.authResponse.accessToken}`;
          this.http.get(url)
            .subscribe(
              data => {
                console.log('[AuthS][FB][login/facebook][success]', data);
                // the Facebook token was successfully received by the web server
                // and it has sent a jwt token
                const body = data.json();
                this.storeResponse(body.userId, body.role, body.jwtToken);

                // route to my-events
                this.router.navigate(['my-events']);

                // to force angular to update the views
                this.appRef.tick();
              },
              error => {
                console.log('[AuthS][FB][login/facebook][error]', error);
                // something went wrong with the sending of the facebook token
              }
            );
        }else{
          console.log('[AuthS][FB][error] not enough permissions', grantedPermissions);
        }
      })
      .catch((error: any) => {
        console.log('[AuthS][FB][error]', error);
      });
  }

  /**
   * It returns true if the user is authenticated, false otherwise.
   * @returns {boolean}
   */
  public isAuthenticated(): boolean {
    const token = this.recoverToken();

    // if the token is not stored the user is not authenticated
    if (token === null){
      return false;
    }else{
      // if the token is expired the user is not authenticated
      if (this.isTokenExpired(token)){
        // clean the localStorage
        localStorage.removeItem(USERID);
        localStorage.removeItem(TOKEN);
        localStorage.removeItem(ROLE);
        return false;
      }
    }

    // the token exists and it is not expired
    return true;
  }

  /**
   * It returns the id of the logged user.
   * @returns {any}
     */
  getUserId(): String {
    if (this.isAuthenticated()){
      const userId = localStorage.getItem(USERID);
      console.log('[AuthService][getUserId]', userId);
      return userId;
    }else{
      return null;
    }
  }


  /** It returns the expiration date of the stored token, if any.
   * @param token
   * @returns {any}
     */
  getTokenExpirationDate(token: string): Date {
    const decoded = jwt_decode(token);

    if (decoded.exp === undefined) return null;

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  /**
   * It checks if the token is expired.
   * @param token
   * @returns {boolean}
     */
  isTokenExpired(token?: string): boolean {
    if (!token) token = this.recoverToken();
    if (!token) return true;

    const date = this.getTokenExpirationDate(token);
    if (date === undefined) return false;
    return !(date.valueOf() > new Date().valueOf());
  }

  /**
   * It returns the token from the local storage.
   */
  private recoverToken(){
    return localStorage.getItem(TOKEN);
  }

  /**
   * It stores the response from logins into the localstorage
   * @param user
   * @param jwtToken
   * @param role
     */
  private storeResponse(userId, role, jwtToken){
    this.storeUserId(userId);
    this.storeToken(jwtToken);
    this.storeRole(role);
  }

  /**
   * It receives the token and stores it.
   * @param token
   */
  private storeToken(token){
    // store the token in localStorage
    localStorage.setItem(TOKEN, token.toString());
    console.log('[AuthService][token stored in localStorage]');
  }


  /**
   * It receives the user from auth endpoints and stores it to localStorage.
   * @param user
   */
  private storeUserId(userId){
    localStorage.setItem(USERID, userId.toString());
    console.log('[AuthService][user stored in localStorage]');
  }

  /**
   * It stores the role in the localStorage.
   * @param role
     */
  private storeRole(role){
    localStorage.setItem(ROLE, role);
    console.log('[AuthService][role stored in localStorage]');
  }

  /**
   * It clears the localStorage removing the currentUser.
   * It also redirects to the home.
   */
  logout(): void {
    console.log('[AuthService][Logout]');
    // clear token remove user from local storage to log user out
    localStorage.removeItem(USERID);
    localStorage.removeItem(TOKEN);
    localStorage.removeItem(ROLE);

    // redirect to the home page
    this.router.navigate(['']);

    // force logout from Facebook SDK
    this.fb.getLoginStatus()
      .then(
        (response) => {
          if(response.status === 'connected'){
            this.fb.logout()
          }
        }
      );

    // to force angular to update the views
    this.appRef.tick();
  }


}
