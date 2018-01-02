import {BrowserModule} from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {AgmCoreModule, GoogleMapsAPIWrapper} from '@agm/core';
import {RouterModule} from '@angular/router';
import {HttpModule} from '@angular/http';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AppComponent} from './app.component';
import {HomePageComponent} from './home-page/home-page.component';
import {LoginPageComponent} from './authentication/login-page/login-page.component';
import {RegistrationPageComponent} from './authentication/registration-page/registration-page.component';
import {ParticipantPageComponent} from './user-pages/participant-page/participant-page.component';
import {CountDownComponent} from './user-pages/count-down/count-down.component';
import {HeaderConnectComponent} from './shared/layout/header-connect/header-connect.component';
import {NavbarComponent} from './shared/layout/navbar/navbar.component';
import {EventsListPageComponent} from './event-pages/events-list-page/events-list-page.component';
import {FooterComponent} from './shared/layout/footer/footer.component';
import {ContactsPageComponent} from './contacts-page/contacts-page.component';
import {PageHeaderComponent} from './shared/layout/page-header/page-header.component';
import {UserService} from './shared/services/user.service';
import {AuthGuard} from './shared/guards/auth.guard';
import {AuthenticationService} from "./authentication/authentication.service";
import {EventDetailPageComponent} from './event-pages/event-detail-page/event-detail-page.component';
import {ProfilePageComponent} from "./user-pages/profile-page/profile-page.component";
import {EventCreatePageComponent} from "./event-pages/event-create-page/event-create-page.component";
import {EventManagePageComponent} from "./event-pages/event-manage-page/event-manage-page.component";

import {FacebookModule} from 'ngx-facebook';
import {MyEventsComponent} from './event-pages/my-events/my-events.component';
import {GuestGuard} from "./shared/guards/guest.guard";
import {EventService} from "./shared/services/event.service";
import {HttpClientService} from "./shared/services/http-client.service";
import {EventBoxComponent} from "./event-pages/event-box/event-box.component";
import {HomeEventBoxComponent} from "./home-page/home-event-box/home-event-box.component";
import {FooterEventBoxComponent} from "./shared/layout/footer/footer-event-box/footer-event-box.component";
import {FaqPageComponent} from './faq-page/faq-page.component';
import {HowItWorksPageComponent} from "./how-it-works-page/how-it-works-page.component";
import {EventBoxOrganizedComponent} from "./event-pages/event-box/event-box-organized.component";
import {EnrolledEventsComponent} from './event-pages/my-events/enrolled-events/enrolled-events.component';
import {OrganizedEventsComponent} from './event-pages/my-events/organized-events/organized-events.component';
import {ConfirmationDialogComponent} from './shared/dialog/confirmation-dialog/confirmation-dialog.component';
import {AlertDialogComponent} from './shared/dialog/alert-dialog/alert-dialog.component';
import {EnrollementDialogComponent} from './shared/dialog/enrollement-dialog/enrollement-dialog.component';
import {DialogService} from "./shared/dialog/dialog.service";
import {CommonModule} from "@angular/common";
import {AddRouteMapComponent} from './shared/map/add-route-map/add-route-map.component';
import {EventManageRouteComponent} from './event-pages/event-manage-route/event-manage-route.component';
import {DirectionDirective} from './shared/map/direction.directive';
import {RouteService} from "./shared/services/route.service";
import {EventProgressComponent} from './event-pages/event-progress/event-progress.component';
import {DisplayMapComponent} from './shared/map/display-map/display-map.component';
import {EventArchiveComponent} from './event-pages/event-archive/event-archive.component';
import {MapComponent} from './event-pages/event-progress/map/map.component';
import {LeaderboardComponent} from './event-pages/event-progress/leaderboard/leaderboard.component';
import {ContactService} from './shared/services/contact.service';
import {SortService} from "./event-pages/event-progress/sort.service";
import {SortableTableDirective} from "./event-pages/event-progress/sortable-table.directive";
import {SortableColumnComponent} from "./event-pages/event-progress/sortable-column/sortable-column.component";
import {Ng4GeoautocompleteModule} from "ng4-geoautocomplete";
import {ManageUsersComponent} from './admin/manage-users/manage-users.component';
import {ManageEventsComponent} from './admin/manage-events/manage-events.component';
import {AdminEditUserDialogComponent} from './shared/dialog/admin-edit-user-dialog/admin-edit-user-dialog.component';
import {AdminEditEventDialogComponent} from './shared/dialog/admin-edit-event-dialog/admin-edit-event-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    LoginPageComponent,
    RegistrationPageComponent,
    ParticipantPageComponent,
    CountDownComponent,
    HeaderConnectComponent,
    NavbarComponent,
    EventsListPageComponent,
    FooterComponent,
    ContactsPageComponent,
    PageHeaderComponent,
    EventDetailPageComponent,
    MyEventsComponent,
    ProfilePageComponent,
    EventCreatePageComponent,
    EventBoxComponent,
    EventBoxOrganizedComponent,
    EventManagePageComponent,
    HomeEventBoxComponent,
    FooterEventBoxComponent,
    EnrollementDialogComponent,
    HowItWorksPageComponent,
    FooterEventBoxComponent,
    FaqPageComponent,
    EnrolledEventsComponent,
    OrganizedEventsComponent,
    ConfirmationDialogComponent,
    AlertDialogComponent,
    AddRouteMapComponent,
    EventManageRouteComponent,
    DirectionDirective,
    EventProgressComponent,
    DisplayMapComponent,
    EventArchiveComponent,
    MapComponent,
    LeaderboardComponent,
    SortableTableDirective,
    SortableColumnComponent,
    ManageUsersComponent,
    ManageEventsComponent,
    AdminEditUserDialogComponent,
    AdminEditEventDialogComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    Ng4GeoautocompleteModule.forRoot(),
    FacebookModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCWY7J8-bVG3TxQbVvgXb-F5lQV6XrTM5s',
      libraries: ["places, address"]
    }),
    RouterModule.forRoot([
      {
        path: '',
        component: HomePageComponent,
        pathMatch: 'full'
      },
      {
        path: 'faq',
        component: FaqPageComponent,
        pathMatch: 'full'
      },
      {
        path: 'events',
        component: EventsListPageComponent,
        pathMatch: 'full'
      },
      {
        path: 'archive',
        component: EventArchiveComponent,
        pathMatch: 'full'
      },
      {
        path: 'admin/users',
        component: ManageUsersComponent,
        pathMatch: 'full'
      },
      {
        path: 'admin/events',
        component: ManageEventsComponent,
        pathMatch: 'full'
      },
      {
        path: 'events/create',
        component: EventCreatePageComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard], // TODO check if possible to add an authGuard based on parameters
      },
      {
        path: 'events/:eventId/manage',
        component: EventManagePageComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard], // TODO check if possible to add an authGuard based on parameters
      },
      {
        path: 'events/:eventId/manage/route',
        component: EventManageRouteComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard]
      },
      {
        path: 'events/:eventId',
        component: EventDetailPageComponent,
        pathMatch: 'full'
      },
      {
        path: 'events/:eventId/progress',
        component: EventProgressComponent,
        children: [
          {path: '', redirectTo: 'map', pathMatch: 'full'},
          {path: 'map', pathMatch: 'full', component: MapComponent},
          {path: 'leaderboard', pathMatch: 'full', component: LeaderboardComponent}
        ]
      },
      {
        path: 'my-events',
        component: MyEventsComponent,
        canActivate: [AuthGuard],
        children: [
          {path: '', redirectTo: 'enrolled', pathMatch: 'full'},
          {path: 'enrolled', pathMatch: 'full', component: EnrolledEventsComponent},
          {path: 'organized', pathMatch: 'full', component: OrganizedEventsComponent}
        ]
      },
      {
        path: 'contacts',
        pathMatch: 'full',
        component: ContactsPageComponent
      },
      {
        path: 'how-it-works',
        pathMatch: 'full',
        component: HowItWorksPageComponent
      },
      {
        path: 'my-profile',
        pathMatch: 'full',
        component: ProfilePageComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'login',
        pathMatch: 'full',
        component: LoginPageComponent,
        canActivate: [GuestGuard]
      },
      {
        path: 'register',
        pathMatch: 'full',
        component: RegistrationPageComponent,
        canActivate: [GuestGuard]
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
    HttpClientService,
    DialogService,
    RouteService,
    ContactService,
    SortService
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
}
