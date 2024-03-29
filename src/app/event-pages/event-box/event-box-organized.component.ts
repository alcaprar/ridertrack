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
  public event: any;


  constructor(private router: Router, private eventService: EventService, private dialogService: DialogService) { }

  public csvFile: File;

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
    this.dialogService.confirmation("Start Event",
      "Are you sure to start the event?",function(){
        this.eventService.startTracking(event).then(
          (error) => {
            if(error){
              console.log("[Start Tracking][error]", error);
              this.dialogService.alert("Start tracking", error.message)
            }else{
              console.log("[Start Tracking][Success]");
              this.event.status = "ongoing";
              this.router.navigate(['/events/', event._id, 'progress']);
            }
          }).catch((error) => {
          console.log("[Start Tracking][Error]", error);
        });
      }.bind(this));
  }

  stopTracking(event) {
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
  }
}
