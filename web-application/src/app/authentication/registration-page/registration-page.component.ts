import { Component, Input, OnInit, Injectable, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import {AuthenticationService} from "../authentication.service";
import {User} from "../../shared/models/user";

@Component({
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrls: ['./registration-page.component.css']
})
export class RegistrationPageComponent implements OnInit {

  registerForm: FormGroup;
  error = '';
  loading = false;

  @Input() user = { name: '', surname: '', email: '', password:''};

  constructor(private formBuilderLogin: FormBuilder, private authService: AuthenticationService) { }

  ngOnInit() {
   this.setFormRegister();
  }

  ngAfterViewInit(){
    // it attaches a listener on the google button
    this.authService.attachGoogleSignIn(document.getElementById('google-register'));
  }

  /**
   * It initializes the form with empty values.
   */
  setFormRegister() {
    this.registerForm = this.formBuilderLogin.group({
      name: ['',[Validators.required, Validators.minLength(2)]],
      surname:  ['',[Validators.required, Validators.minLength(2)]],
      email:  ['',[Validators.required, Validators.email]],
      password:['',[Validators.required, Validators.minLength(5)]]
      });
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
   * It is called when the user clicks the button.
   * It calls the register method of the authservice and wait for the result.
   */
  register() {
    this.error = '';
    this.loading = true;

    // create an instance if user model
    var user = new User(
      this.registerForm.get('email').value,
      this.registerForm.get('name').value,
      this.registerForm.get('surname').value,
      this.registerForm.get('password').value
    );

    console.log('[RegistrationComponent][Register]', user);
    this.authService.register(user)
    .subscribe(
      result => {
        this.loading = false;
        if(result){
          console.log('[RegistrationComponent][Register]', result);
        }else {
          this.error = 'The email address already exist, please insert valid credentials';
        }
      }
    )
  }

}
