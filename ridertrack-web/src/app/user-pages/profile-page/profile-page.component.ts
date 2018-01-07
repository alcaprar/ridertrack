import {Component, Input, OnInit, Injectable, OnChanges, ViewEncapsulation} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../shared/services/user.service';
import { User } from '../../shared/models/user';
import { DialogService } from "../../shared/dialog/dialog.service";
import { AuthenticationService } from '../../authentication/authentication.service';
import {Router} from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-profile-page',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {

  private user: User = new User();
  public errors: Error[]=[];
  public name: String;
  public surname: String;
  public email: String;


  public userSettingCity: any ;

  private urlImage: any;
  private urlNoImage = '../../../assets/img/user_fake_img.png';

  constructor(private router: Router, private formBuilderLogin: FormBuilder, private userService: UserService, private dialogService: DialogService, private authService: AuthenticationService) { }

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this.userService.getUser().subscribe(
      (user: User) => {
        this.user = user;
        console.log("[GettingUser]", user);
        if(user.city !== null && user.city !== undefined){
          this.userSettingCity = {
            showSearchButton: false,
            geoTypes: ['(cities)'],
            showCurrentLocation: false,
            inputPlaceholderText: user.city
          };
        }else {
          this.userSettingCity = {
            showSearchButton: false,
            geoTypes: ['(cities)'],
            showCurrentLocation: false,
            inputPlaceholderText: ''
          };
        }
        if(user.logo !== null && user.logo !== undefined){
          this.urlImage = '/api/users/' + this.user._id + '/logo';
        }
      }
    );
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
    this.errors = [];
    console.log('[MyProfile][deleteUser]');
    this.dialogService.confirmation('Delete user account', 'Are you sure you want to delete your user account?', function () {
      console.log('[MyProfile][deleteUser][callback]');
      this.userService.deleteUser()
        .then(
          (errors) => {
            if(errors){
              this.dialogService.alert('Delete user account', errors)
              this.errors = errors;
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

 updateUser() {
      this.errors = [];
   // get the logo from the input image
   var logo = $('#logo').prop('files')[0];
   this.user.logo = logo;

    this.userService.updateCurrentUser(this.user)
      .then((response)=>{
          console.log("[currentUserUpdated][Success]", response);
          this.dialogService.alert("Success", "Your profile is correctly updated!");
          this.getUser();
        }).catch((error)=> {
        console.log("[currentUserUpdated][Error]", error);
        this.errors = error;
    });
 }


  autocompleteCity(selectedData: any){
    for(let i=0; i< selectedData.data.address_components.length; i++){
      if(['administrative_area_level_3', 'locality'].indexOf(selectedData.data.address_components[i].types[0]) > -1) {
        this.user.city = selectedData.data.address_components[i].long_name;
        console.log("[Updated][City]" + this.user.city);
      }
    }
  }

}
