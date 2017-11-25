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

  errors: Error[] = [];
  loading = false;

  constructor(private fbLogin: FormBuilder, private router: Router, private authService: AuthenticationService) { }

  ngOnInit() {
   this.setFormLogin();
  }


  ngAfterViewInit(){
    // it attaches a listener on the google button
    this.authService.attachGoogleSignIn(document.getElementById('google-signin'), this.showErrors.bind(this));
  }

  // setting the login form
  setFormLogin() {
    this.loginForm = this.fbLogin.group({
      email: [this.user ? this.user.email :''],
      password: [this.user ? this.user.password : '']
      });
    // clean the errors
    this.errors = []
  }

  /**
   * It is called when the user clicks login.
   * It calls the login method of authservice and wait for a results.
   * If the login fails it shows the errors.
   */
  login() {
    this.errors = [];
    this.loading = true;

    var user = new User(
      this.loginForm.get('email').value,
      '',
      '',
      this.loginForm.get('password').value
    );
    console.log('[LoginComponent][Login]', user);
    this.authService.login(user)
      .then(
        (errors: Error[]) => {
          console.log('[LoginComponent][Login result]', errors);
          this.loading = false;

          // if errors is null, login is successful
          if(errors){
            // show the errors if errors is not null
            this.showErrors(errors);
          }
        }
      )
  }

  showErrors(errors: Error[]){
    console.log('[Login COmponent][showErrors]', errors);
    this.errors = errors;
  }

  /**
   * It is called when the user clicks the facebook button.
   * It calls the method of the authservice that manages the Facebook login.
   */
  loginFB(){
    this.errors = [];
    this.loading = true;
    this.authService.loginWithFacebook()
      .then(
        (errors: Error[]) =>{
          this.loading = false;

          if(errors){
            this.showErrors(errors)
          }
        }
      )
  }

}
