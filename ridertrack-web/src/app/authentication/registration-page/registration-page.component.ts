import { Component, Input, OnInit, Injectable, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import {AuthenticationService} from "../authentication.service";
import {User} from "../../shared/models/user";
import {Router} from "@angular/router";
declare var grecaptcha:any;

@Component({
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrls: ['./registration-page.component.css']
})
export class RegistrationPageComponent implements OnInit {

  registerForm: FormGroup;
  errors: Error[]= [];
  loading = false;

  @Input() user = { name: '', surname: '', email: '', password:''};

  constructor(private formBuilderLogin: FormBuilder, private authService: AuthenticationService,
              private router: Router) { }

  ngOnInit() {
    this.setFormRegister();
  }

  ngAfterViewInit(){
    // it attaches a listener on the google button
    this.authService.attachGoogleSignIn(document.getElementById('google-register'), this.showErrors.bind(this));

    //renders therecaptcha
    setTimeout(function () {
      grecaptcha.render('g-recaptcha', {
        sitekey: "6LfraT0UAAAAAJBZIVy8RWXrRQvqHXAhnRpCJHaw"
      })
    }, 2000)
  }

  /**
   * It initializes the form with empty values.
   */
  setFormRegister() {
    this.registerForm = this.formBuilderLogin.group({
      name: ['',[Validators.required, Validators.minLength(2)]],
      surname:  ['',[Validators.required, Validators.minLength(2)]],
      email:  ['',[Validators.required, Validators.email]],
      password:['',[Validators.required, Validators.minLength(5)]],
      confirmPassword:['',[Validators.required, Validators.minLength(5)]]
    },{validator: this.checkIfMatchingPasswords('password', 'confirmPassword')});

    this.errors = [];
  }

  checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
      let passwordInput = group.controls[passwordKey],
        passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({notEquivalent: true})
      }
      else {
        return passwordConfirmationInput.setErrors(null);
      }
    }
  }

  keyDownFunction(event) {
    if(event.keyCode == 13) {
      this.register();
    }
  }

  showErrors(errors: Error[]){
    console.log('[Register Component][showErrors]', errors);
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

  /**
   * It is called when the user clicks the button.
   * It calls the register method of the authservice and wait for the result.
   */
  register() {
    this.errors = [];

    var recaptchaResponse = grecaptcha.getResponse();
    if(!recaptchaResponse){
      var error = new Error('Please verify that you are not a robot.')
      this.showErrors([error]);
    }else{
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
        .then(
          (errors: Error[]) => {
            console.log('[RegistrationComponent][Register] errors:', errors);
            this.loading = false;

            if(errors){
              this.showErrors(errors);
            }else{
              this.router.navigate(['my-events']);
            }
          }
        )
    }
  }

}
