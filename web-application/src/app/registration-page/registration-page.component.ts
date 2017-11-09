import { Component, Input, OnInit, Injectable, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrls: ['./registration-page.component.css']
})
export class RegistrationPageComponent implements OnInit {

  respond: any;
  registerForm: FormGroup;
  @Input() user = { name: '', surname: '', email: '', password:'', role: ''};

  constructor(private http: HttpClient, private fbLogin: FormBuilder, private router: Router) { }

  ngOnInit() {
   this.setFormRegister();
  }

  setFormRegister() {
    this.registerForm = this.fbLogin.group({
      name: [this.user ? this.user.name : ''],
      surname: [this.user ? this.user.surname : ''],
      email: [this.user ? this.user.email : ''],
      password: [this.user ? this.user.password : ''],
      role: [this.user ? this.user.role : '']
      });
  }

  register() {
    this.user.name = this.registerForm.get('name').value;
    this.user.surname = this.registerForm.get('surname').value;
    this.user.email = this.registerForm.get('email').value;
    this.user.password = this.registerForm.get('password').value;
    this.user.role = this.registerForm.get('role').value;
    const body = {
      name: this.user.name,
      surname: this.user.surname,
      email: this.user.email,
      password: this.user.password,
      role: this.user.role
    };
    console.log('Registering...');
    console.log(body);
    this.http.post('http://localhost:5000/api/auth/register', body).subscribe(res => {
      this.respond = res;
      console.log('Respond: ');
      console.log(res);
      if(this.respond.user.role === "organizer"){
        this.router.navigate(['event-admin']);
      } else if(this.respond.user.role === "participant") {
        this.router.navigate(['participant']);
      }
      alert('Welcome ' + this.respond.user.name);
    })
  }

}
