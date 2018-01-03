import { Component, OnInit } from '@angular/core';
import {DialogService} from "../dialog.service";
import { User } from '../../models/user';
import {UserService} from "../../services";
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

  constructor(private dialogService: DialogService, private userService: UserService) {
    this.dialogService.register("adminEditUser", this);
  }

  ngOnInit() {
  }


  show(title, user: User, selection) {
    this.title = title;
    this.selection = selection;
    if(user !== null){
      this.user = user;
    }
    console.log("[adminEditUserDialog][User][Show]", this.user);
    $('#adminEditUserDialog').modal('show');
  }

  save() {
    if(this.selection === 'edit' ) {
      //TODO: Call the update of the user
      //TODO: Call the update of the role if different from the default one
      console.log('[adminEditUserDialog][User Updated]');
      $('#adminEditUserDialog').modal('hide');
    }
    if(this.selection === 'create'){
      //TODO: Call the creation of the user
      //TODO: Call the update of the role if different from the default one
      console.log('[adminEditUserDialog][User Created]');
      $('#adminEditUserDialog').modal('hide');
    }
  }

  cancel(){
    console.log('[adminEditUserDialog][Cancel]');
    $('#adminEditUserDialog').modal('hide');
  }

}
