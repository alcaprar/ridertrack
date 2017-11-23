import { Component, Input, OnInit, Injectable, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../shared/services/user.service';
import { User } from '../../shared/models/user';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {

  private user: User = new User();
  editForm: FormGroup;
  name: String;
  surname: String;
  email: String;
  
  @Input() editData = { name: '', surname: '', email: ''};

  constructor(private formBuilderLogin: FormBuilder, private userService: UserService) { }

  ngOnInit() {
    this.userService.getUser().subscribe(
      (user: User) =>{
        this.user = user;
      }
    );
    this.setFormEdit();
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
