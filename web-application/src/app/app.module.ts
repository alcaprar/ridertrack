import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { RegistrationPageComponent } from './registration-page/registration-page.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ParticipantPageComponent } from './participant-page/participant-page.component';
import { EventAdminPageComponent } from './event-admin-page/event-admin-page.component';
import { HeaderConnectComponent } from './header-connect/header-connect.component';
import { NavbarComponent } from './navbar/navbar.component';
import { EventsListPageComponent } from './events-list-page/events-list-page.component';
import { FooterComponent } from './footer/footer.component';
import { ContactsPageComponent } from './contacts-page/contacts-page.component';
import { PageHeaderComponent } from './page-header/page-header.component';
import {UserService} from './user.service';
import {AuthguardGuard} from './authguard.guard';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    LoginPageComponent,
    RegistrationPageComponent,
    AboutUsComponent,
    ParticipantPageComponent,
    EventAdminPageComponent,
    HeaderConnectComponent,
    NavbarComponent,
    EventsListPageComponent,
    FooterComponent,
    ContactsPageComponent,
    PageHeaderComponent
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
        canActivate: [AuthguardGuard],
        component: ParticipantPageComponent
      } ,
      {
        path: 'event-admin',
        canActivate: [AuthguardGuard],
        component: EventAdminPageComponent
      } ,
      {
        path: 'about-us',
        component: AboutUsComponent
      },
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
  providers: [UserService, AuthguardGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
