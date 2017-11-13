import { Component, Input, OnInit, Injectable, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { Router } from '@angular/router';
import {AuthenticationService} from "../authentication.service";

@Component({
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrls: ['./registration-page.component.css']
})
export class RegistrationPageComponent implements OnInit {

  respond: any;
  registerForm: FormGroup;
  error = '';
  loading = false;

  @Input() user = { name: '', surname: '', email: '', password:''};

  constructor(private http: HttpClient, private fbLogin: FormBuilder, private router: Router, private authService: AuthenticationService) { }

  ngOnInit() {
   this.setFormRegister();
  }

  setFormRegister() {
    this.registerForm = this.fbLogin.group({
      name: [this.user ? this.user.name : ''],
      surname: [this.user ? this.user.surname : ''],
      email: [this.user ? this.user.email : ''],
      password: [this.user ? this.user.password : '']
      });
  }

  register() {
    this.error = '';
    this.loading = true;
    this.user.name = this.registerForm.get('name').value;
    this.user.surname = this.registerForm.get('surname').value;
    this.user.email = this.registerForm.get('email').value;
    this.user.password = this.registerForm.get('password').value;
    const body = {
      name: this.user.name,
      surname: this.user.surname,
      email: this.user.email,
      password: this.user.password
    };
    console.log('Registering...');
    console.log(body);
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

}
