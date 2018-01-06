import { Component, OnInit } from '@angular/core';
import {DialogService} from "../dialog.service";
import { User } from '../../models/user';
import {UserService} from "../../services";
import {AuthenticationService} from "../../../authentication/authentication.service";
import {Router} from "@angular/router";
declare var $: any;

@Component({
  selector: 'app-admin-edit-user-dialog',
  templateUrl: './admin-edit-user-dialog.component.html',
  styleUrls: ['./admin-edit-user-dialog.component.css']
})
export class AdminEditUserDialogComponent implements OnInit {

  private user: User = new User();
  private pastUser: User = new User();
  private userRoles = ['user', 'administrator'];
  private selection: string;
  private title: string;
  private error: Error[];

  constructor(private dialogService: DialogService, private userService: UserService, private auth: AuthenticationService,
              private router: Router) {
    this.dialogService.register("adminEditUser", this);
  }

  ngOnInit() {
  }


  show(title, user: User, selection) {
    this.title = title;
    this.selection = selection;
    if(user !== null){
      this.user = user;
    }else {
      this.user =new User();
    }
    console.log("[adminEditUserDialog][User][Show]", this.user);
    $('#adminEditUserDialog').modal('show');
  }

  save() {
    if(this.selection === 'edit' ) {
      console.log("[User][toEdit]", this.user);
      this.userService.updateUserById(this.user._id, this.user)
        .then((response)=> {
          console.log('[adminEditUserDialog][User Updated]');
          $('#adminEditUserDialog').modal('hide');
          }).catch((error)=>{
        this.error = error;
        console.log('[adminEditUserDialog][UserUpdate][Error]', this.error);
      });
    }
    if(this.selection === 'create') {
      console.log("[User][toCreate]", this.user);
      this.auth.register(this.user).then((error)=>{
        if(error){
          this.error = error;
          console.log("[UserCreate][Error]", this.error);
        }else {
          this.router.navigate(['/admin','users']);
          console.log("[UserCreate][Success]");
        }
      });
    }
  }

  cancel(){
    console.log('[adminEditUserDialog][Cancel]');
    this.selection = '';
    this.user = new User();
    $('#adminEditUserDialog').modal('hide');
  }

  close(){
    console.log('[adminEditUserDialog][Close]');
    this.selection = '';
    this.user = new User;
  }

}
