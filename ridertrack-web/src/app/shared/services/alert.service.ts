import { Injectable } from '@angular/core';
import {Router, NavigationStart} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {Subject} from 'rxjs/Subject';
import {Alert, AlertType} from '../models/alert';

@Injectable()
export class AlertService {

  private keepAfterRouteChange = false;
  private subject = new Subject <Alert> ();

  constructor(private router: Router) {
    //clear alert messages on router changes
    router.events.subscribe(event => {
      if( event instanceof  NavigationStart){
        if (this.keepAfterRouteChange) {
          this.keepAfterRouteChange = false;
        } else {
          this.clear();
        }
      }
    });
  }

  getAlert() : Observable<any> {
    return this.subject.asObservable();
  }

  alert(type: AlertType, message : string, keepAfterRouteChange = false){
    this.keepAfterRouteChange = keepAfterRouteChange;
    this.subject.next(<Alert> {type: type, message: message});
  }

  clear() {
    this.subject.next();
  }

  success(message: string, keepAfterRouteChange = false) {
    this.alert(AlertType.Success, message,keepAfterRouteChange);
  }

  error(message: string, keepAfterRouteChange = false) {
    this.alert(AlertType.Error, message,keepAfterRouteChange);
  }

  info(message: string, keepAfterRouteChange = false) {
    this.alert(AlertType.Info, message,keepAfterRouteChange);
  }



}
