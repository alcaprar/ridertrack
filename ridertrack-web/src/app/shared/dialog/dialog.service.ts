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

  adminEditUser(title,user, selection){
    console.log('[DialogService][adminEditUser]', user);
    this.dialogs['adminEditUser'].show(title, user, selection);
  }

  adminEditEvent(title, event, selection){
    console.log('[DialogService][adminEditEvent]', event);
    this.dialogs['adminEditEvent'].show(title, event, selection);
  }

  enrollement(title, eventId, isEnrolled){
    console.log('[DialogService][enrollement]', this.dialogs);
    this.dialogs['enrollement'].show(title, eventId, isEnrolled);
  }

}
