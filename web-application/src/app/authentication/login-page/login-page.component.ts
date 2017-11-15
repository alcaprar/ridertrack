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

  error = '';
  loading = false;

  constructor(private fbLogin: FormBuilder, private router: Router, private authService: AuthenticationService) { }

  ngOnInit() {
   this.setFormLogin();
  }

  // setting the login form
  setFormLogin() {
    this.loginForm = this.fbLogin.group({
      email: [this.user ? this.user.email : ''],
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
      this.loginForm.get('password').value,
      '',
      ''
    );
    console.log('[LoginComponent][Login]', user);
    this.authService.login(user)
      .subscribe(
        result => {
          console.log('[LoginComponent][Login result]', result);
          this.loading = false;
          if(!result){
            this.error = 'Invalid credentals. Try again.';
          }
        }
      )
  }

  loginFB(){
    this.error = '';
    this.loading = true;
    this.authService.loginWithFacebook()
  }
  
  logout(){
    this.authService.logout();
  }

}
