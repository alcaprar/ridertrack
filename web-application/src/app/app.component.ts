import { Component } from '@angular/core';
import {constructDependencies} from "@angular/core/src/di/reflective_provider";
import {UserService} from "./user.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(private auth: UserService){};
}

