import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { RegistrationPageComponent } from './registration-page/registration-page.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ParticipantPageComponent } from './participant-page/participant-page.component';
import { EventAdminPageComponent } from './event-admin-page/event-admin-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    LoginPageComponent,
    RegistrationPageComponent,
    AboutUsComponent,
    ParticipantPageComponent,
    EventAdminPageComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      {
        path: 'home',
        component:  HomePageComponent
      } ,
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
      } ,
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
        component: ParticipantPageComponent
      } ,
      {
        path: 'event-admin',
        component: EventAdminPageComponent
      } ,
      {
        path: 'about-us',
        component: AboutUsComponent
      }
    ]),
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
