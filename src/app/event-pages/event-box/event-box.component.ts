import { Component, OnInit, Input } from '@angular/core';
import {Router} from "@angular/router";
import {DialogService} from "../../shared/dialog/dialog.service";
import {User} from "../../shared/models/user";
import {UserService} from "../../shared/services/user.service";

@Component({
  selector: 'app-event-box',
  templateUrl: './event-box.component.html',
  styleUrls: ['./event-box.component.css']
})
export class EventBoxComponent implements OnInit {

  @Input()
  public event: any;

  @Input()
  public enrolled: boolean;

  public currentUser: User = new User();

  constructor(private router: Router, private  dialogService:DialogService,private userService: UserService) { }

  ngOnInit() {
    console.log('[EventBox][Init]', this.event);
    this.userService.getUser()
      .subscribe(
        (user) => {
          this.currentUser = user
        });
  }

  addDevice() {
    this.dialogService.enrollement("Manage Enrollment", this.event._id, true, function(){}.bind(this));
  }
}
