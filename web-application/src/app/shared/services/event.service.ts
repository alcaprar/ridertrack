import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {Event} from '../models/event';
import {Observable} from 'rxjs/Observable';
import {EventToCreate} from "../models/eventToCreate";
import {HttpClientService} from "./http-client.service";
import {environment} from '../../../environments/environment'
import {User} from "../models/user";
import {EventsListQueryParams} from "../models/eventsListQueryParams";

@Injectable()
export class EventService {

  private BASE_URL = environment.baseAPI;
  private BASE_EVENT_URL = '/api/events';

  private eventTypes: [String] = ['running', 'cycling', 'hiking', 'triathlon', 'other'];

  constructor(private http: HttpClientService, private router: Router) {
  }

  getEventTypes(){
    return this.eventTypes;
  }

  /**
   * Perform an HTTP GET request to the REST API to read all the events
   * @returns {Promise<Event[]>}
   */
  getAllEvents(queryParams: EventsListQueryParams): Promise<[Event[], number, number, number]> {
    const url = `${this.BASE_EVENT_URL}?${this.serializeQueryString(queryParams)}`;

    console.log('[EventService][getAllEvents]', url);

    return this.http.get(url).toPromise()
        .then( (response) => {
          const body = response.json();
          const events = body.events as Event[];
          console.log('[EventService][getAllEvents][success]', body);
         return [events, body.page, body.itemsPerPage, body.totalPages];
        }, (err) => {
          console.log('[EventService][getAllEvents][error]', err);
          return Observable.of(null);
        });
  }

  /**
   * Perform an HTTP GET request to the REST API to read all the events that specific user has organized
   * @returns {Promise<Event[]>}
   */
  getOrganizedEventsForUser(id): Promise<Event[]> {
    const url = `${this.BASE_URL}/users/${id}/organizedEvents`;

    return this.http.get(url).toPromise()
        .then( (res) => {
          const eventsBody = res.json().events as Event[];
          console.log('[EventService][getOrganizedEventsForUser][success]', eventsBody);
         return eventsBody;
        }, (err) => {
          console.log('[EventService][getOrganizedEventsForUser][error]', err);
          return Observable.of(null);
        });
  }

/**
   * Perform an HTTP GET request to the REST API to read all the events in which specific user has enrolled
   * @returns {Promise<Event[]>}
   */
  getEnrolledEventsForUser(id): Promise<Event[]> {
    const url = `${this.BASE_URL}/users/${id}/enrolledEvents`;

    return this.http.get(url).toPromise()
        .then( (res) => {
          const eventsBody = res.json().events as Event[];
          console.log('[EventService][getEnrolledEventsForUser][success]', eventsBody);
         return eventsBody;
        }, (err) => {
          console.log('[EventService][getEnrolledEventsForUser][error]', err);
          return Observable.of(null);
        });
  }

  /**
   * It retrieves a certain amount of events ordered by date ascending.
   * @param amount
     */
  getLastEvents(amount): Promise<Event[]> {
    const url = `${this.BASE_EVENT_URL}?sort=startingDate=asc&page=1&itemsPerPage=${amount}`;

    return this.http.get(url).toPromise()
      .then( (res) => {
        const eventsBody = res.json().events as Event[];
        console.log('[EventService][getLastEvents][success]', eventsBody);
        return eventsBody;
      }, (err) => {
        console.log('[EventService][getLastEvents][error]', err);
        return Observable.of(null);
      });
  }

  getOrganizer(eventId): Promise<User>{
    const url = `${this.BASE_EVENT_URL}/${eventId}/organizer`;

    return this.http.get(url).toPromise()
      .then( (res) => {
        const organizer = res.json().organizer as User;
        console.log('[EventService][getOrganizer][success]', organizer);
        return organizer;
      }, (err) => {
        console.log('[EventService][getOrganizer][error]', err);
        return Observable.of(null);
      });
  }

  /**
   * Perform an HTTP GET request to the REST API to read a specific event by id   *
   * @param id
   * @returns {Promise<Event>} of the event
   */
  getEvent(id): Promise<Event> {
    const url = `${this.BASE_EVENT_URL}/${id}`;
    return this.http.get(url).toPromise()
      .then((res) => {
        const eventBody = res.json().event as Event;
        return eventBody;
      })
      .catch(error => {
        console.log('[EventService][getEvent][error]', error);
        return Promise.reject(error.message || error);
      });
  }

  /**
   * Perform an HTTP POST to REST API to create an event
   * @param {Event} event
   * @returns {Promise<Event>} of the event
   */
  createEvent(event: EventToCreate): Promise<Event> {
    const url = `${this.BASE_EVENT_URL}`;

    // create form data in order to pass an image
    var formData = new FormData();
    formData.append('logo', event.logo);
    formData.append('name', event.name);
    formData.append('type', event.type);
    formData.append('startingDate', event.startingDate);
    formData.append('country', event.country);
    formData.append('city', event.city);



    return this.http.post(url, formData).toPromise()
      .then(
        (res) => {
          const eventBody = res.json().event as Event;
          console.log('[EventService][createEvent][success]', eventBody);
          this.router.navigate(['my-events']);
          return eventBody;
      })
      .catch(
        (error) => {
          console.log('[EventService][createEvent][error]', error);
          return Promise.reject(error.json());
      });
  }

  /**
   * Perform an HTTP PUT request to REST API to update a certain event
   * @param id of the event
   * @param {Event} event updated
   * @returns {Promise<Event>}
   */
  updateEvent(id, event: Event): Promise<Event> {
    const url = `${this.BASE_EVENT_URL}/${id}`;

    console.log("[EventService][UpdateEvent][eventToPass]", event);
    // create form data in order to pass an image

    return this.http.put(url , event).toPromise()
      .then(
        (res) => {
          const eventBody = res.json().event as Event;
          console.log('[EventService][updateEvent][success]', eventBody);
          return eventBody;
        })
      .catch(error => {
          console.log('[EventService][updateEvent][error]', error);
          this.router.navigate(['/manage-event', event._id]);
        return Promise.reject(error.message || error);
        });
    }

  /**
   * Perform an HTTP DELETE request to REST API to delete a certain event
   * @param id of the event
   * @returns {Promise<void>} of the event deleted
   */
  deleteEvent(id): Promise<void> {
    const url = `${this.BASE_EVENT_URL}/${id}`;
    return this.http.delete(url).toPromise()
      .then(() => null)
      .catch((error) => {
          console.log('[EventService][deleteEvent][error]', error);
        return Promise.reject(error.message || error);
        });
  }

  /**
   * Perform an HTTP POST to REST API to enroll to an event
   * @param eventid
   * @returns enrollment message
   */
  enrollToEvent(eventid){
    const url = `${this.BASE_URL}/enrollments`;
    var body = {eventId: eventid}

    return this.http.post(url, body).toPromise()
      .then(
        (res) => {
          const eventBody = res.json();
          console.log('[EventService][enroll][success]', eventBody);
          return eventBody;
      })
      .catch(
        (error) => {
          console.log('[EventService][enroll][error]', error);
          return Promise.reject(error.json());
      });
  }

  /**
   * Perform an HTTP DELETE to REST API to withdraw enrollment to an event
   * @param eventid
   * @returns enrollment message
   */
  withdrawEnrollment(eventId, userId){
    const url = `${this.BASE_URL}/enrollments/${eventId}/${userId}`;

    return this.http.delete(url).toPromise()
      .then(
        (res) => {
          const respondMessage = res.json();
          console.log('[EventService][deleteEnrollment][success]', respondMessage);
          return respondMessage;
      })
      .catch(
        (error) => {
          console.log('[EventService][deleteEnrollment][error]', error);
          return Promise.reject(error.json());
      });
  }

  private serializeQueryString(obj) {
    var str = [];
    for(var p in obj)
      if (obj[p] !== undefined) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  }

}

