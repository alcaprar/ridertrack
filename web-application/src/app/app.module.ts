import { BrowserModule } from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {AgmCoreModule, AgmMap, GoogleMapsAPIWrapper} from '@agm/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
import {AuthGuard} from './shared/guards/auth.guard';
import {AuthenticationService} from "./authentication/authentication.service";
import {EventDetailPageComponent} from './event-pages/event-detail-page/event-detail-page.component';
import { ProfilePageComponent} from "./user-pages/profile-page/profile-page.component";
import {EventCreatePageComponent} from "./event-pages/create-event-page/event-create-page.component";


import { FacebookModule } from 'ngx-facebook';
import { MyEventsComponent } from './event-pages/my-events/my-events.component';
import {GuestGuard} from "./shared/guards/guest.guard";
import {EventService} from "./shared/services/event.service";
import { MapComponent } from './shared/map/display_map/map.component';
import {HttpClientService} from "./shared/services/http-client.service";
import {EventBoxComponent} from "./event-pages/event-box/event-box.component";


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
    MyEventsComponent,
    ProfilePageComponent,
    MapComponent,
    EventCreatePageComponent,
    EventBoxComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    FacebookModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCWY7J8-bVG3TxQbVvgXb-F5lQV6XrTM5s'
    }),
    RouterModule.forRoot([
      {
        path: '',
        component:  HomePageComponent,
        pathMatch: 'full'
      } ,
      {
        path: 'events',
        component: EventsListPageComponent
      },
      {
        path: 'create-event',
        component: EventCreatePageComponent,
        //canActivate: [AuthGuard]
      },
      /**
       *  when you want to redirect to the event detail page,
       *  you have to call: routerLink= "/event/{{event.id}}" for each single event
       *  so if you have a list of events: *ngFor="let event of events" routerLink="/event/{{event.id}}"
       */
      {
        path: 'event/:id',
        component: EventDetailPageComponent
      },
      {
        path: 'contacts',
        component: ContactsPageComponent
      },
      {
        path: 'my-profile',
        component: ProfilePageComponent,
        //canActivate: [AuthGuard]
      },
      {
        path: 'login',
        component: LoginPageComponent,
        canActivate: [GuestGuard]
      } ,
      {
        path: 'register',
        component: RegistrationPageComponent,
        canActivate: [GuestGuard]
      } ,
      {
        path: 'my-events',
        component: MyEventsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: '**',
        redirectTo: '/',
        pathMatch: 'full'
      }
    ]),
    HttpModule
  ],
  providers: [
    UserService,
    AuthGuard,
    GuestGuard,
    AuthenticationService,
    EventService,
    GoogleMapsAPIWrapper,
    HttpClientService
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
