import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import {Observable} from "rxjs/Observable";
import {Response} from '@angular/http';
import {FacebookService, InitParams, LoginResponse} from 'ngx-facebook';
import { Router } from '@angular/router';
import {User} from '../shared/models/user';
import 'rxjs/add/operator/catch.js'
import 'rxjs/Rx';

@Injectable()
export class AuthenticationService {
  private BASE_AUTH_URL: string = 'http://localhost:5000/api/auth';

  public token : String;
  public user : User;

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
  login(user : User) : Observable<boolean> {
    console.log('[AuthS][ClassicalLogin]');
    let url: string = `${this.BASE_AUTH_URL}/login`;
    return this.http.post(url, {email: user.email, password: user.password})
      .map(
        (response : Response) => {
          console.log('[AuthS][ClassicalLogin][success]', response.json());

          let body = response.json();

          this.storeUser(body.user);
          this.storeToken(body.jwtToken);

          // route to my-events
          this.router.navigate(['my-events']);

          return true;
        }
      )
      .catch(
        (error : any) => {
          console.log('[AuthS][ClassicalLogin][error]', error.json());
          return Observable.of(false);
        }
      )
  }

  /**
   * It sends a post to the web server with the user details.
   * If the registration is successfull it receives also a token and redirects to the private page.
   * @param user
   * @returns {any|Promise<R>|Promise<T>|Maybe<T>}
     */
  register(user : User): Observable<boolean> {
    let url: string = `${this.BASE_AUTH_URL}/register`;
    return this.http.post(url, {name: user.name, surname: user.surname, email: user.email, password: user.password})
      .map(
        (response: Response) => {
          console.log('[AuthS][Register][success]', response);
          // the registration succedeed
          let body = response.json();

          this.storeUser(body.user);
          this.storeToken(body.jwtToken);

          // route to my-events
          this.router.navigate(['my-events']);

          return true;
        }
      )
      .catch(
        (error : any) => {
          console.log('[AuthS][Registration][error]', error.json());
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
              let body = data.json();
              this.storeUser(body.user);
              this.storeToken(body.jwtToken);

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
    this.user = JSON.parse(localStorage.getItem('user'));
    this.token = localStorage.getItem('token');
  }

  /**
   * It receives the token and stores it.
   * @param token
     */
  storeToken(token){
    // store the token in localStorage
    this.token = token;
    localStorage.setItem('token', this.token.toString());
  }


  /**
   * It receives the user from auth endpoints and stores it to localStorage.
   * @param user
     */
  storeUser(user){
    this.user = user;
    localStorage.setItem('user', JSON.stringify(this.user));
  }

  /**
   * It returns true if the user is authenticated, false otherwise.
   * @returns {boolean}
     */
  public isAuthenticated() : boolean {
    // TODO check token expiration
    return (this.token !== null)
  }


  /**
   * It clears the localStorage removing the currentUser.
   * It also redirects to the home.
   */
  logout(): void {
    console.log('Logging out...');
    // clear token remove user from local storage to log user out
    this.token = null;
    this.user = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    // redirect to the home page
    this.router.navigate(['']);
  }
}
