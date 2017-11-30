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

}
