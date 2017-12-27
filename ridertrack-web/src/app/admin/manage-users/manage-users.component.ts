import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { EventService } from '../../shared/services/event.service';
import { User } from '../../shared/models/user';
import { Event } from '../../shared/models/event';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../authentication/authentication.service';
import { Router } from "@angular/router";
import { DialogService } from "../../shared/dialog/dialog.service";
import { RouteService } from "../../shared/services/route.service";
import { FacebookService, UIParams, UIResponse, InitParams } from "ngx-facebook/dist/esm/index";

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {

  users: any;

  constructor(private route: ActivatedRoute,
    private userService: UserService,
    private eventService: EventService,
    private authService: AuthenticationService,
    private router: Router,
    private routeService: RouteService,
    private dialogService: DialogService,
    private fb: FacebookService) { }

  ngOnInit() {
    this.userService.getAllUsers().then(
      (response) => {
        console.log('[AdminUsers][getAllUsers]', response);
        this.users = response;
      });
  }

  userClicked(user){
    console.log('USER: ');
    console.log(user);
    this.dialogService.adminEditUser('Edit user account', user);
  }

}
