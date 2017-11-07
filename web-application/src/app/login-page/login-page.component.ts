import { Component, Input, OnInit, Injectable, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  loginForm: FormGroup;
  @Input() user = { username_text: '', password_text: ''};

  constructor(private fbLogin: FormBuilder, private router: Router) { }

  ngOnInit() {
   this.setFormLogin();
  }

  setFormLogin() {
    this.loginForm = this.fbLogin.group({
      username_text: [this.user ? this.user.username_text : ''],
      password_text: [this.user ? this.user.password_text : '']
      });
  }

  logIn() {
    this.user.username_text = this.loginForm.get('username_text').value;
    this.user.password_text = this.loginForm.get('password_text').value;
    const body = {
      username: this.user.username_text,
      password: this.user.password_text,
    };
    console.log('Logging');
    console.log(body);
  }

}
