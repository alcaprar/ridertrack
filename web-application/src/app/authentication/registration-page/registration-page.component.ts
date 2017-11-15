import { Component, Input, OnInit, Injectable, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { Router } from '@angular/router';
import {AuthenticationService} from "../authentication.service";
import {User} from "../../shared/models/user";

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

  constructor(private http: HttpClient, private formBuilderLogin: FormBuilder, private router: Router, private authService: AuthenticationService) { }

  ngOnInit() {
   this.setFormRegister();
  }

  setFormRegister() {
    this.registerForm = this.formBuilderLogin.group({
      name: '',
      surname: '',
      email: '',
      password: ''
      });
  }

  /**
   * It is called when the user clicks the button.
   * It calls the register method of the authservice and wait for the result.
   */
  register() {
    this.error = '';
    this.loading = true;

    // create an instance if user model
    var user = new User(
      this.registerForm.get('email').value,
      this.registerForm.get('password').value,
      this.registerForm.get('name').value,
      this.registerForm.get('surname').value
    );

    console.log('[RegistrationComponent][Register]', user);
    this.authService.register(user)
    .subscribe(
      result => {
        this.loading = false;
        if(result){
          console.log('[RegistrationComponent][Register]', result);
        }else{
          this.error = 'Registration failed.';
        }
      }
    )
  }

}
