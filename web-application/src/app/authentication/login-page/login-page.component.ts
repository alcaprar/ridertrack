import { Component, Input, OnInit, Injectable, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {AuthenticationService} from "../authentication.service";
import {User} from "../../shared/models/user";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  loginForm: FormGroup;
  respond: any;
  @Input() user = { name: '', surname: '', email: '', password:'', role: ''};

  error: any = '';
  loading = false;

  constructor(private fbLogin: FormBuilder, private router: Router, private authService: AuthenticationService) { }

  ngOnInit() {
   this.setFormLogin();
  }


  ngAfterViewInit(){
    // it attaches a listener on the google button
    this.authService.attachGoogleSignIn(document.getElementById('google-signin'));
  }

  // setting the login form
  setFormLogin() {
    this.loginForm = this.fbLogin.group({
      email: [this.user ? this.user.email :''],
      password: [this.user ? this.user.password : '']
      });
  }

  /**
   * It is called when the user clicks login.
   * It calls the login method of authservice and wait for a results.
   * If the login fails it shows the errors.
   */
  login() {
    this.error = '';
    this.loading = true;

    var user = new User(
      this.loginForm.get('email').value,
      '',
      '',
      this.loginForm.get('password').value
    );
    console.log('[LoginComponent][Login]', user);
    this.authService.login(user)
      .subscribe(
        result => {
          console.log('[LoginComponent][Login result]', result);
          this.loading = false;
        }, error => {
          console.log('[LoginComponent][Login error]', error);
          this.error = error;
          this.loading = false;
        }
      )
  }

  /**
   * It is called when the user clicks the facebook button.
   * It calls the method of the authservice that manages the Facebook login.
   */
  loginFB(){
    this.error = '';
    this.loading = true;
    this.authService.loginWithFacebook()
  }

  /**
   * It calls the logout method of the authservice.
   */
  logout(){
    this.authService.logout();
  }

}
