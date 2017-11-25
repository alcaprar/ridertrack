import { Component, OnInit } from '@angular/core';
import {Alert, AlertType} from "../../models/alert";
import {AlertService} from "../../services/alert.service";

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html'
})
export class AlertComponent implements OnInit {

  private alert: Alert = null;

  constructor(private alertService: AlertService) { }

  ngOnInit() {
    this.alertService.getAlert().subscribe((alert: Alert) => {
      if(!alert){
        return;
      }
      this.alert =alert;
      this.alertService.clear();
    })
  }


  cssClass (alert: Alert){
    if(!alert) {
      return;
    }
    switch (alert.type) {
      case AlertType.Success:
        return 'alert alert-success';
      case AlertType.Error:
        return 'alert alert-danger';
      case AlertType.Info:
        return 'alert alert-info';
    }
  }

}
