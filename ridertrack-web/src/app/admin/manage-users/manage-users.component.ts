import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { ActivatedRoute } from '@angular/router';
import {SortService} from "../../event-pages/event-progress/sort.service";
import {User} from "../../shared/models";
import {DialogService} from "../../shared/dialog/dialog.service";

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit, OnChanges {


  users: any;

  constructor(private route: ActivatedRoute,private userService: UserService, private sortService: SortService,
              private dialogService: DialogService) { }

  ngOnInit() {
    this.getUsers();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.getUsers();
  }

  getUsers() {
    this.userService.getAllUsers().then(
      (response) => {
        console.log('[AdminUsers][getAllUsers]', response);
        this.users = response;
        this.sortService.sortTable({sortColumn: 'name', sortDirection:'asc'}, this.users);
      });
  }

  onSorted($event){
    this.sortService.sortTable($event, this.users);
  }

  edit(user: User){
    let currentUser = user;
    this.dialogService.adminEditUser("Edit User", currentUser, 'edit');
  }

  delete(user: User){
    let userId = user;
    this.dialogService.confirmation("Delete", "Are you sure to delete this User?", function () {
      this.userService.deleteUserById(userId);
      this.getUsers();
    }.bind(this));
  }

  createUser() {
    this.dialogService.adminEditUser("Create User", null, 'create');
  }
}
