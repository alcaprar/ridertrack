import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import {Observable} from "rxjs/Observable";
import {Response} from '@angular/http';
import {FacebookService, InitParams, LoginResponse} from 'ngx-facebook';
import { Router } from '@angular/router';
import 'rxjs/add/operator/catch.js'
import 'rxjs/Rx';

@Injectable()
export class AuthenticationService {
  private BASE_AUTH_URL: string = 'http://localhost:5000/api/auth';

  public token : String;

  constructor(private http: Http, private fb: FacebookService, private router: Router) {
    // set token if saved in local storage
    this.recoverToken();

    // init Facebook strategy
    let initParams: InitParams = {
      appId: '278876872621248',
      xfbml: true,
      version: 'v2.8'
    };
    fb.init(initParams);
  }

  /**
   * It calls the api passing email and password.
   * If the credentials are valid it stores the received token in localStorage and return true.
   * If they are invalid, it returns false.
   * @param email
   * @param password
   * @returns {Subscription}
     */
  login(email : String, password : String): Observable<Object> {
    let url: string = `${this.BASE_AUTH_URL}/login`;
    return this.http.post(url, {email: email, password: password})
      .map(
        (response: Response) => {
          // login successful
          let body = response.json();
          // store the token in localStorage
          this.token = body.jwtToken;
          localStorage.setItem('currentUser', JSON.stringify({
            user: body.user,
            jwtToken: body.jwtToken
          }));
          return body.user;
        }
      )
      .catch(
        (error : any) => {
          console.log('An error occured in authentication service. ', error);
          return Observable.of(false);
        }
      )
  }

  register(name: String, surname: String, email : String, password : String): Observable<Object> {
    let url: string = `${this.BASE_AUTH_URL}/register`;
    return this.http.post(url, {name: name, surname: surname, email: email, password: password})
      .map(
        (response: Response) => {
          // login successful
          let body = response.json();
          // store the token in localStorage
          this.token = body.jwtToken;
          localStorage.setItem('currentUser', JSON.stringify({
            user: body.user,
            jwtToken: body.jwtToken
          }));
          return body.user;
        }
      )
      .catch(
        (error : any) => {
          console.log('An error occured in authentication service. ', error);
          return Observable.of(false);
        }
      )
  }

  /**
   * It calls the method login of the Facebook SDK and wait for results.
   * If the login is successful it sends the received token to the web server to get a JWT token
   */
  loginWithFacebook(){
    console.log('[AuthS][FB]');
    // call the login method of Facebook SDK
    this.fb.login()
      .then((response: LoginResponse) => {
        // facebook login is successful and returned a token
        // we send this token to our web server
        console.log('[AuthS][FB][success]', response);
        let url: string = `${this.BASE_AUTH_URL}/login/facebook?access_token=${response.authResponse.accessToken}`;
        this.http.get(url)
          .subscribe(
            data => {
              console.log('[AuthS][FB][login/facebook][success]', data);
              // the Facebook token was successfully received by the web server
              // and it has sent a jwt token
              this.storeToken(data);
              
              // route to my-events
              this.router.navigate(['my-events'])
            },
            error => {
              console.log('[AuthS][FB][login/facebook][error]', error);
              // something went wrong with the sending of the facebook token
            }
          )
      })
      .catch((error: any) => {
        console.log('[AuthS][FB][error]', error);
      });
  }

  /**
   * It recovers the token from the local storage.
   */
  private recoverToken(){
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;
  }

  /**
   * It receives the response from the web server and stores the token.
   * @param response
     */
  storeToken(response){
    let body = response.json();
    // store the token in localStorage
    this.token = body.jwtToken;
    localStorage.setItem('currentUser', JSON.stringify({
      user: body.user,
      jwtToken: body.jwtToken
    }));
  }

  public isAuthenticated() : boolean {
    // TODO check token expiration
    return (this.token !== null)
  }


  /**
   * It clears the localStorage removing the currentUser.
   */
  logout(): void {
    console.log('Logging out...');
    // clear token remove user from local storage to log user out
    this.token = null;
    localStorage.removeItem('currentUser');

  }
}
