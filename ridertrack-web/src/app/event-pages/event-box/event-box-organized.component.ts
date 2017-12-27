import {Component, OnInit, Input, Output} from '@angular/core';
import {Router} from "@angular/router";
import {EventService} from "../../shared/services/event.service";
import {DialogService} from "../../shared/dialog/dialog.service";

@Component({
  selector: 'app-event-box-organized',
  templateUrl: './event-box-organized.component.html',
  styleUrls: ['./event-box.component.css']
})
export class EventBoxOrganizedComponent implements OnInit {

  @Input()
  event: any;


  constructor(private router: Router, private eventService: EventService, private dialogService: DialogService) { }

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
  }

  /**
   * It is triggered when the user clicks the button.
   * It call the method of the eventService and shows errros, if any.
   * If the call is successfull it redirects to the progress page.
   * @param event
     */
  startTracking(event){
  //  if(this.checkStarting()) {
      this.eventService.startTracking(event).then(
        (errors) => {
          if(errors){
            console.log("[Start Tracking][error]", errors);
            this.dialogService.alert("Start tracking", errors[0].message)
          }else{
            console.log("[Start Tracking][Success]");
            this.event.status = "ongoing";
            this.router.navigate(['/events/', event._id, 'progress']);
          }
      }).catch((error) => {
        console.log("[Start Tracking][Error]", error);
      });
    //} else {
      //this.dialogService.confirmation("Error",
       // "Sorry the tracking can start only after the registration period is closed",function(){
        //});
    }
 // }

  stopTracking(event) {
 //   if(this.checkStopping()) {
      this.dialogService.confirmation("Stop Event",
        "Are you sure to stop the event?",function(){
          this.eventService.stopTracking(event)
            .then((success) => {
              console.log("[Stop Tracking][Success]");
              this.event.status = "passed";
            }).catch((error) => {
            console.log("[Stop Tracking][Error]", error);
          });
      }.bind(this));
    }/*else{
      this.dialogService.confirmation("Stop Event",
        "Sorry the tracking cannot be stopped during the Event",function(){
        });
    }
  }*/

  checkStarting(){
    if(this.event.startingDate && this.event.enrollementClosingAt){
      let split = this.event.startingDate.split(/\//);
      let startingDate = new Date(+split[2], +split[1] - 1, +split[0]);
      let split_close = this.event.enrollementClosingAt.split(/\//);
      let close = new Date(+split_close[2], +split_close[1] - 1, +split_close[0]);
      let today = new Date();

      return startingDate >= today && today > close;
    } else {
      return false;
    }
  }

  checkStopping(){
    if(this.event.startingDate && this.event.status === "ongoing"){
      let split = this.event.startingDate.split(/\//);
      let startingDate = new Date(+split[2], +split[1] - 1, +split[0]);
      let today = new Date();

      return startingDate <= today;
    } else {
      return false;
    }
  }
}
