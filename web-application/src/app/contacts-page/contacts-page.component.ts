import { Component, Input, OnInit, Injectable, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-contacts-page',
  templateUrl: './contacts-page.component.html',
  styleUrls: ['./contacts-page.component.css']
})
export class ContactsPageComponent implements OnInit {

  contactForm: FormGroup;

  @Input() message = { name: '', surname: '', email: '', subject:'', message:''};

  constructor(private formBuilderLogin: FormBuilder) { }

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
      message:''
      });
  }

  /**
   * It is called when the user clicks the button.
   */
  contact(){
    // create an instance if user model
    var message = {
      name:this.contactForm.get('firstname').value,
      surname:this.contactForm.get('lastname').value,
      email:this.contactForm.get('email').value,
      subject:this.contactForm.get('subject').value,
      message:this.contactForm.get('message').value
    }
    console.log(message);
  }

}
