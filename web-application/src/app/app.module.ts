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
import { LoginPageComponent } from './authentication/login-page/login-page.component';
import { RegistrationPageComponent } from './authentication/registration-page/registration-page.component';
import { ParticipantPageComponent } from './user-pages/participant-page/participant-page.component';
import { CountDownComponent } from './user-pages/count-down/count-down.component';
import { EventAdminPageComponent } from './event-pages/event-admin-page/event-admin-page.component';
import { HeaderConnectComponent } from './shared/layout/header-connect/header-connect.component';
import { NavbarComponent } from './shared/layout/navbar/navbar.component';
import { EventsListPageComponent } from './event-pages/events-list-page/events-list-page.component';
import { FooterComponent } from './shared/layout/footer/footer.component';
import { ContactsPageComponent } from './contacts-page/contacts-page.component';
import { PageHeaderComponent } from './shared/layout/page-header/page-header.component';
import {UserService} from './shared/services/user.service';
import {AuthguardGuard} from './shared/guards/authguard.guard';
import {AuthenticationService} from "./authentication/authentication.service";
import {EventDetailPageComponent} from './event-pages/event-detail-page/event-detail-page.component';


import { FacebookModule } from 'ngx-facebook';

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
    FacebookModule.forRoot(),
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
