import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { RegistrationPageComponent } from './registration-page/registration-page.component';
import { ParticipantPageComponent } from './participant-page/participant-page.component';
import { CountDownComponent } from './count-down/count-down.component';
import { EventAdminPageComponent } from './event-admin-page/event-admin-page.component';
import { HeaderConnectComponent } from './header-connect/header-connect.component';
import { NavbarComponent } from './navbar/navbar.component';
import { EventsListPageComponent } from './events-list-page/events-list-page.component';
import { FooterComponent } from './footer/footer.component';
import { ContactsPageComponent } from './contacts-page/contacts-page.component';
import { PageHeaderComponent } from './page-header/page-header.component';
import {UserService} from './_services/user.service';
import {AuthguardGuard} from './_guards/authguard.guard';
import {AuthenticationService} from "./_services/authentication.service";
import {EventDetailPageComponent} from './event-detail-page/event-detail-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    LoginPageComponent,
    RegistrationPageComponent,
    ParticipantPageComponent,
    CountDownComponent,
    EventAdminPageComponent,
    HeaderConnectComponent,
    NavbarComponent,
    EventsListPageComponent,
    FooterComponent,
    ContactsPageComponent,
    PageHeaderComponent,
    EventDetailPageComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,

    RouterModule.forRoot([
      {
        path: 'home',
        component:  HomePageComponent
      } ,

      {
        path: 'events',
        component: EventsListPageComponent
      },
      {
        path: 'event',
        component: EventDetailPageComponent
      },
      {
        path: 'contacts',
        component: ContactsPageComponent
      },
      {
        path: 'login',
        component: LoginPageComponent
      } ,
      {
        path: 'register',
        component: RegistrationPageComponent
      } ,
      {
        path: 'participant',
        /*canActivate: [AuthguardGuard],*/
        component: ParticipantPageComponent
      } ,
      {
        path: 'count-down',
        component: CountDownComponent
      },
      {
        path: 'event-admin',
        canActivate: [AuthguardGuard],
        component: EventAdminPageComponent
      } ,
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
      } ,
      {
        path: '**',
        redirectTo: '/home',
        pathMatch: 'full'
      }
    ]),
    HttpModule
  ],
  providers: [
    UserService,
    AuthguardGuard,
    AuthenticationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
