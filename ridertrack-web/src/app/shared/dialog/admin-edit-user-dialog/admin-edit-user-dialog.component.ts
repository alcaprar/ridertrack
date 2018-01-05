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
  private userRoles = ['user', 'administrator'];
  private selection: string;
  private title: string;
  private error: string;

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
    this.error ='';
    if(this.selection === 'edit' ) {
      this.userService.updateUserById(this.user.id, this.user)
        .then((user)=> {
          if(user){
            console.log('[adminEditUserDialog][User Updated]');
          }else {
            this.error = user;
            this.dialogService.alert("Error", this.error);
          }
          $('#adminEditUserDialog').modal('hide');
        });
    }

    if(this.selection === 'create') {
      this.auth.register(this.user).then(()=>{
        this.router.navigate(['admin/users']);
        $('#adminEditUserDialog').modal('hide');
      });
    }
  }

  cancel(){
    console.log('[adminEditUserDialog][Cancel]');
    $('#adminEditUserDialog').modal('hide');
  }

}
