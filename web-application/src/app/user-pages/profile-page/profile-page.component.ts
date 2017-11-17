import { Component, Input, OnInit, Injectable, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import {UserService} from '../../shared/services/user.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {

  editForm: FormGroup;
  user: any;
  
  @Input() editData = { name: '', surname: '', email: ''};

  constructor(private formBuilderLogin: FormBuilder, private userService: UserService) { }

  ngOnInit() {
    this.setFormEdit();
    this.user = this.userService.getUser();
    console.log(this.user);
   }

   setFormEdit() {
    this.editForm = this.formBuilderLogin.group({
      name: '',
      surname: '',
      email: ''
      });
  }

  edit(){
    // create an instance if user model
    var editData = {
      name:this.editForm.get('name').value,
      surname:this.editForm.get('surname').value,
      email:this.editForm.get('email').value
    }
    console.log(editData);
  }

}
