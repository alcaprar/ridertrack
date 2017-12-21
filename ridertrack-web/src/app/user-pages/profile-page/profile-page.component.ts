import { Component, Input, OnInit, Injectable, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../shared/services/user.service';
import { User } from '../../shared/models/user';
import { DialogService } from "../../shared/dialog/dialog.service";
import { AuthenticationService } from '../../authentication/authentication.service';
import {Router} from '@angular/router';
import { Error } from '../../shared/index';


@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {

  private user: User = new User();
  editForm: FormGroup;
  name: String;
  surname: String;
  email: String;


  private urlImage: any;
  private urlNoImage = '../../../assets/img/user_fake_img.png';

  constructor(private router: Router, private formBuilderLogin: FormBuilder, private userService: UserService, private dialogService: DialogService, private authService: AuthenticationService) { }

  ngOnInit() {
    this.userService.getUser().subscribe(
      (user: User) => {
        this.user = user;
      }
    );
  }


  edit() {
    console.log("[User locally updated]", this.user);
  }


  urlChanged(event: any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.onload = (event: any) => {
        this.urlImage = event.target.result;
      },
        reader.readAsDataURL(event.target.files[0]);
    }
  }

  /**
   * it is triggered when the user clicks the delete account button.
   * It calls the user service.
   * If any error occurred, it shows them.
   */
  deleteUser() {
    console.log('[MyProfile][deleteUser]');
    this.dialogService.confirmation('Delete user account', 'Are you sure you want to delete your user account?', function () {
      console.log('[MyProfile][deleteUser][callback]');
      this.userService.deleteUser()
        .then(
          (errors) => {
            if(errors){
              this.dialogService.alert('Delete user account', errors[0].message)
            }else{
              console.log('[MyProfile][deleteUser][success]');
            }
          }
        )
        .catch(
          (error) => {
            console.log('[MyProfile][deleteUser][error]', error);
          }
        );
    }.bind(this));
  }

  /* updateUserProfile() {
   console.log('[MyProfile][updateUserProfile]');
   console.log('[MyProfile][updateUserProfile][callback]');
   this.userService.updateUserProfile(this.authService.getUserId())
   .then(
   (message) => {
   console.log('[MyProfile][updateUserProfile][success]', message);
   this.authService.logout();
   this.router.navigate(['']);
   }
   )
   .catch(
   (error) => {
   console.log('[MyProfile][updateUserProfile][error]', error);
   // TODO show errors
   }
   );
   }*/

  /**
   * It is called when the user clicks on the create button.
   * It calls the method of event service waiting for a response.
   */
  /* onSubmit(){
   // the datepicker is not detected by angular form
   this.event.startingDate = $('#startingDate.datepicker').val();
   this.event.enrollmentOpeningAt = $('#enrollmentOpeningAt.datepicker').datepicker("getDate" );
   this.event.enrollmentClosingAt = $('#enrollmentClosingAt.datepicker').datepicker("getDate" );

   this.event.logo = $('#logo').prop('files')[0];

   console.log('[EventManage][onSubmit]',$('#enrollmentOpeningAt.datepicker').datepicker("getDate" ))
   this.eventService.updateEvent(this.event._id, this.event)
   .then(
   (response) => {
   console.log('[UpdateEvent][onSubmit][success]', response);
   if(response[0] !== null){
   // errors occureed
   this.errors = response[0] as Error[];
   }else{
   var event: Event = response[1] as Event;
   this.router.navigate(['/events/', event._id]);
   }
   }
   )
   .catch(
   (error) => {
   console.log('[CreateEvent][onSubmit][error]', error);
   this.router.navigate(['/events', 'create']);
   }
   );
   } */

}
