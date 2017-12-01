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
import {EventCreatePageComponent} from "./event-pages/event-create-page/event-create-page.component";
import {EventManagePageComponent} from "./event-pages/event-manage-page/event-manage-page.component";




import { FacebookModule } from 'ngx-facebook';
import { MyEventsComponent } from './event-pages/my-events/my-events.component';
import {GuestGuard} from "./shared/guards/guest.guard";
import {EventService} from "./shared/services/event.service";
import { MapComponent } from './shared/map/display_map/map.component';
import {HttpClientService} from "./shared/services/http-client.service";
import {EventBoxComponent} from "./event-pages/event-box/event-box.component";
import {HomeEventBoxComponent} from "./home-page/home-event-box/home-event-box.component";
import { InvalidMessageDirective } from './authentication/invalid-message.directive';
import {InvalidTypeDirective} from "./authentication/invalid-type.directive";
import {FooterEventBoxComponent} from "./shared/layout/footer/footer-event-box/footer-event-box.component";
import { FaqPageComponent } from './faq-page/faq-page.component';
import {WhyRidertrackBestPageComponent} from "./why-ridertrack-best-page/why-ridertrack-best-page.component";
import { AlertComponent } from './shared/layout/alert/alert.component';
import {AlertService} from "./shared/services/alert.service";
import {EventBoxOrganizedComponent} from "./event-pages/event-box/event-box-organized.component";
import { EnrolledEventsComponent } from './event-pages/my-events/enrolled-events/enrolled-events.component';
import { OrganizedEventsComponent } from './event-pages/my-events/organized-events/organized-events.component';
import { ConfirmationDialogComponent } from './shared/dialog/confirmation-dialog/confirmation-dialog.component';
import {DialogService} from "./shared/dialog/dialog.service";
import {CommonModule} from "@angular/common";
import { AddRouteMapComponent } from './shared/map/add-route-map/add-route-map.component';
import { EventManageRouteComponent } from './event-pages/event-manage-route/event-manage-route.component';

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
    EventBoxComponent,
    EventBoxOrganizedComponent,
    EventManagePageComponent,
    HomeEventBoxComponent,
    InvalidMessageDirective,
    InvalidTypeDirective,
    FooterEventBoxComponent,
    WhyRidertrackBestPageComponent,
    FooterEventBoxComponent,
    FaqPageComponent,
    AlertComponent,
    EnrolledEventsComponent,
    OrganizedEventsComponent,
    ConfirmationDialogComponent,
    AddRouteMapComponent,
    EventManageRouteComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    FacebookModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCWY7J8-bVG3TxQbVvgXb-F5lQV6XrTM5s',
      libraries: ["places"]
    }),
    RouterModule.forRoot([
      {
        path: '',
        component:  HomePageComponent,
        pathMatch: 'full'
      } ,
      {
        path: 'faq',
        component: FaqPageComponent,
        pathMatch: 'full'
      },
      {
        path: 'events',
        component: EventsListPageComponent
      },
      {
        path: 'events/create',
        component: EventCreatePageComponent,
        canActivate: [AuthGuard], // TODO check if possible to add an authGuard based on parameters
      },
      {
        path: 'events/:eventId',
        component: EventDetailPageComponent
      },
      {
        path: 'events/:eventId/manage',
        component: EventManagePageComponent,
        canActivate: [AuthGuard], // TODO check if possible to add an authGuard based on parameters
      },
      {
        path: 'events/:eventId/manage/route',
        component: EventManageRouteComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'my-events',
        component: MyEventsComponent,
        canActivate: [AuthGuard],
        children: [
          { path: '', redirectTo: 'enrolled', pathMatch: 'full'},
          { path: 'enrolled', component: EnrolledEventsComponent},
          { path: 'organized', component: OrganizedEventsComponent}
        ]
      },
      {
        path: 'contacts',
        component: ContactsPageComponent
      },
      {
        path: 'why-best',
        component: WhyRidertrackBestPageComponent
      },
      {
        path: 'my-profile',
        component: ProfilePageComponent,
        canActivate: [AuthGuard]
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
    HttpClientService,
    AlertService,
    DialogService
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
