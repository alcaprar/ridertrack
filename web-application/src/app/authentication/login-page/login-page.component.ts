import { Component, Input, OnInit, Injectable, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {AuthenticationService} from "../authentication.service";

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

  // this method is called when clicking the Login button
  // it calls API POST method to the web server with the body containing email and password
  // if credentials are correct you'll get userid, name, surname, email and role in response
  // then, depending on your role you are routed to the participant-page or the event-admin-page
  login() {
    this.error = '';
    this.loading = true;
    this.user.email = this.loginForm.get('email').value;
    this.user.password = this.loginForm.get('password').value;
    console.log('Logging in...');
    this.authService.login(this.user.email, this.user.password)
      .subscribe(
        result => {
          this.loading = false;
          if(result){
            console.log(result);
            this.router.navigate(['home']);
          }else{
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
