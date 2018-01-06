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

  adminEditUser(title,userid, selection, callback){
    console.log('[DialogService][adminEditUser]', userid);
    this.dialogs['adminEditUser'].show(title, userid, selection, callback);
  }

  adminEditEvent(title, eventid, selection, callback){
    console.log('[DialogService][adminEditEvent]', eventid);
    this.dialogs['adminEditEvent'].show(title, eventid, selection, callback);
  }

  enrollement(title, eventId, isEnrolled){
    console.log('[DialogService][enrollement]', this.dialogs);
    this.dialogs['enrollement'].show(title, eventId, isEnrolled);
  }

  participants(participantsList){
    console.log('[DialogService][participants]', this.dialogs);
    this.dialogs['participants'].show(participantsList);
  }

}
