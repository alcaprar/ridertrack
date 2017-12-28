import { Component, OnInit } from '@angular/core';
import {DialogService} from "../dialog.service";
import { User } from '../../models/user';
declare var $: any;

@Component({
  selector: 'app-admin-edit-user-dialog',
  templateUrl: './admin-edit-user-dialog.component.html',
  styleUrls: ['./admin-edit-user-dialog.component.css']
})
export class AdminEditUserDialogComponent implements OnInit {

  private callback;
  private title = 'Title';
  private body = 'Body';
  private editedUser: User;

  constructor(private dialogService: DialogService) {
    this.dialogService.register('adminEditUser', this)
  }

  ngOnInit() {
  }


  show(title, body) {
     /* this.editedUser = body;
     console.log('[EditedUser]:');
     console.log(this.editedUser); */
    console.log('[adminEditUserDialog][show]', title, body);
    this.title = title;
    this.body = body;
    $('#adminEditUserDialog').modal('show');

  }

  ok() {
    console.log('[adminEditUserDialog][ok]');
    $('#adminEditUserDialog').modal('hide');
  }

  cancel(){
    console.log('[adminEditUserDialog][cancel]');
    $('#adminEditUserDialog').modal('hide');
  }

  user(body){
    // this.editedUser = body;
    this.editedUser.email = body.email;
    this.editedUser.name = body.name;
    this.editedUser.surname = body.surname;
    this.editedUser.id = body._id;
    console.log('[EditedUser]:');
    console.log(this.editedUser);

  }




}
