import { Component, Input, OnInit, Injectable, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {UserService} from "../user.service";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  loginForm: FormGroup;
  respond: any;
  @Input() user = { name: '', surname: '', email: '', password:'', role: ''};

  constructor(private http: HttpClient, private fbLogin: FormBuilder, private router: Router, private auth:UserService) { }

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
    this.user.email = this.loginForm.get('email').value;
    this.user.password = this.loginForm.get('password').value;
    const body = {
      email: this.user.email,
      password: this.user.password
    };
    console.log('Logging in...');
    console.log(body);
    this.http.post('http://localhost:5000/api/auth/login', body).subscribe(res => {
      this.respond = res;
      console.log('Respond: ');
      console.log(res);
      if(this.respond.user.role === "organizer"){
        this.auth.setRole("organizer");
        this.auth.setUserLoggedIn();
        this.router.navigate(['event-admin']);
      } else if(this.respond.user.role === "participant") {
        this.auth.setRole("participant");
        this.auth.setUserLoggedIn();
        this.router.navigate(['participant']);
      }
      alert('Welcome ' + this.respond.user.name);
    });
  }

}
