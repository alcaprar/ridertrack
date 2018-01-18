import { Component, Input, OnInit, Injectable, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ContactService } from '../shared/services/contact.service';
import { DialogService } from "../shared/dialog/dialog.service";

@Component({
  selector: 'app-contacts-page',
  templateUrl: './contacts-page.component.html',
  styleUrls: ['./contacts-page.component.css']
})
export class ContactsPageComponent implements OnInit {

  public contactForm: FormGroup;

  @Input() message = { name: '', surname: '', email: '', subject: '', message: '' };

  constructor(private formBuilderLogin: FormBuilder, private contactService: ContactService, private dialogService: DialogService) { }

  ngOnInit() {
    this.setFormContact();
  }

  /**
  * It initializes the form with empty values.
  */
  setFormContact() {
    this.contactForm = this.formBuilderLogin.group({
      firstname: '',
      lastname: '',
      email: '',
      subject: '',
      message: ''
    });
  }

  contact() {
    var message = {
      firstname: this.contactForm.get('firstname').value,
      lastname: this.contactForm.get('lastname').value,
      email: this.contactForm.get('email').value,
      subject: this.contactForm.get('subject').value,
      message: this.contactForm.get('message').value
    }
    this.contactService.sendEmail(message).then(
      (response) => {
        console.log('[ContactForm][sendMail][success]', response);
          this.dialogService.alert("Your message has been successfully sent!","");
      }
    )
      .catch(
      (error) => {
        console.log('[ContactForm][sendMail][error]', error);
        this.dialogService.alert("An error occured: ", error.message);
      }
      )
  }

}
