import { Injectable } from '@angular/core';

@Injectable()
export class DialogService {

  private dialogs: any = {};

  constructor() { }

  register(id, component){
    this.dialogs[id] = component;
  }

  confirmation(title, body, callback){
    console.log('[DialogService][confirmation]');
    this.dialogs['confirmation'].show(title, body, callback);
  }

  alert(title, body){
    console.log('[DialogService][alert]', this.dialogs);
    this.dialogs['alert'].show(title, body);
  }

  adminEditUser(title, body){
    console.log('[DialogService][adminEditUser]', body);
    this.dialogs['adminEditUser'].show(title, body.email);
  }

  adminEditEvent(title, body){
    console.log('[DialogService][adminEditEvent]', body);
    // this.dialogs['adminEditEvent'].user(body);
    this.dialogs['adminEditEvent'].show(title, body);
  }

  enrollement(title, callback, isEnrolled, callbackWithdrawEnrollement){
    console.log('[DialogService][enrollement]', this.dialogs);
    this.dialogs['enrollement'].show(title, callback, isEnrolled, callbackWithdrawEnrollement);
  }

}
