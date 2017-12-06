import { Component, OnInit, Input } from '@angular/core';
import {Router} from "@angular/router";
import {EventService} from "../../shared/services/event.service";
import {AlertService} from "../../shared/services/alert.service";

@Component({
  selector: 'app-event-box-organized',
  templateUrl: './event-box-organized.component.html',
  styleUrls: ['./event-box.component.css']
})
export class EventBoxOrganizedComponent implements OnInit {

  @Input()
  event: any;

  constructor(private router: Router, private eventService: EventService, private alert: AlertService) { }

  csvFile: File;

  ngOnInit() {
    console.log('[EventBox][Init]', this.event)
  }

  fileChangeListener(e: any) {
    //get the file
    this.csvFile = e.target.files[0];
    //check if the format is correct
    if(this.csvFile.name.endsWith(".csv")){
      //upload the file
      //TODO: Integration with the server that stores the file
      let fileReader = new FileReader();
      fileReader.onload = (e) => {
        console.log(fileReader.result);
      };
      fileReader.readAsText(this.csvFile);
    }
    else {
      setTimeout(this.alert.error("The file uploaded is not a .CSV file"), 5000);
    }
  }

  startTracking(event){
    this.eventService.startTracking(event).then((success) => {
      console.log("TRACK STARTING");
      this.event.status = "ongoing";
      this.router.navigate(['/events/', event._id , 'progress']);
    }).catch((error) => {
      setTimeout(this.alert.error(error.message), 3000);
    });
  }

  stopTracking(event) {
    this.eventService.stopTracking(event)
      .then((success) => {
      console.log("TRACK STOPPED");
      this.event.status = "passed";
    }).catch((error) => {
      setTimeout(this.alert.error(error.message), 3000);
    });
  }
}
