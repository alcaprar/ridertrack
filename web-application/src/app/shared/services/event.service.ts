import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {Event} from '../models/event';
import {Observable} from 'rxjs/Observable';
import {EventToCreate} from "../models/eventToCreate";
import {HttpClientService} from "./http-client.service";
import {environment} from '../../../environments/environment'
import {User} from "../models/user";
import {Error} from "../models/error";
import {EventsListQueryParams} from "../models/eventsListQueryParams";
import {MyEventsQueryParams} from "../models/myEventsQueryParams";

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
  getOrganizedEventsForUser(userId, queryParams: MyEventsQueryParams): Promise<[Event[], number, number, number]> {
    const url = `${this.BASE_URL}/users/${userId}/organizedEvents?${this.serializeQueryString(queryParams)}`;

    return this.http.get(url).toPromise()
      .then(
        (response) => {
          const body = response.json();
          const events = body.events as Event[];
          console.log('[EventService][getOrganizedEventsForUser][success]', body);
          return [events, body.page, body.itemsPerPage, body.totalPages];
        }, (err) => {
          console.log('[EventService][getOrganizedEventsForUser][error]', err);
          return Observable.of(null);
        });
  }
  /**
   * Perform an HTTP GET request to the REST API to read all the events in which specific user has enrolled
   * @returns {Promise<Event[]>}
   */
  getEnrolledEventsForUser(userId, queryParams: MyEventsQueryParams): Promise<[Event[], number, number, number]> {
    const url = `${this.BASE_URL}/users/${userId}/enrolledEvents?${this.serializeQueryString(queryParams)}`;

    return this.http.get(url).toPromise()
      .then(
        (response) => {
          const body = response.json();
          const events = body.events as Event[];
          console.log('[EventService][getEnrolledEventsForUser][success]', body);
          return [events, body.page, body.itemsPerPage, body.totalPages];
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
    const url = `${this.BASE_EVENT_URL}?sort=startingDate:asc&page=1&itemsPerPage=${amount}`;

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

  /**
   * It retrieves similar events.
   */
  getSimilarEvents(amount, type): Promise<Event[]> {
    const url = `${this.BASE_EVENT_URL}?type=${type}&page=1&itemsPerPage=${amount}`;

    return this.http.get(url).toPromise()
      .then( (res) => {
        const body = res.json();
        const event = body.events as Event[];
        console.log('[EventService][getLastEvents][success]', body);
        return event;
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
   * Perform an HTTP POST to REST API to create an event.
   */
  createEvent(event: EventToCreate): Promise<[Error[], Event]> {
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
          const body = res.json();
          const event = body.event as Event;
          console.log('[EventService][createEvent][success]', body);
          //this.router.navigate(['my-events']);
          return [null, event];
        })
      .catch(
        (errorResponse: any) => {
          var errors = errorResponse.json().errors as Error[];
          console.log('[EventService][createEvent][error]', errors);
          return [errors, new Event()];
        }
      )
  }

  /**
   * Perform an HTTP PUT request to REST API to update a certain event
   * @param id of the event
   * @param {Event} event updated
   * @returns {Promise<Event>}
   */
  updateEvent(id, event: Event): Promise<[Error[], Event]> {
    const url = `${this.BASE_EVENT_URL}/${id}`;

    console.log("[EventService][UpdateEvent][eventToPass]", event);
    // create form data in order to pass an image

    var formData = new FormData();
    for(let key in event){
      if(event[key] !== undefined){
        formData.append(key, event[key])
      }
    }

    return this.http.put(url , formData).toPromise()
      .then(
        (response) => {
          const body = response.json();
          var event = body.event as Event;
          console.log('[EventService][updateEvent][success]', response);
          return [null, event];
        })
      .catch(
        (errorResponse: any) => {
          var errors = errorResponse.json().errors as Error[];
          console.log('[EventService][updateEvent][error]', errors);
          return [errors, new Event()];
        }
      )
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

  getParticipants(eventId): Promise<String[]>{
    const url = `${this.BASE_EVENT_URL}/${eventId}/participantsList`;

    console.log("[EventService][getParticipantsList]", eventId);

    return this.http.get(url).toPromise()
      .then(
        (response) => {
          const body = response.json();
          var participants = body.participants as String[];
          console.log('[EventService][updateEvent][success]', body, participants);
          return participants;
        })
      .catch(
        (error) => {
          console.log('[EventService][updateEvent][error]', error);
          return [];
        });
  }

  /**
   * Perform an HTTP POST to REST API to enroll to an event
   * @param eventid
   * @returns enrollment message
   */
  enrollToEvent(eventId): Promise<boolean>{
    const url = `${this.BASE_URL}/enrollments`;
    var body = {
      eventId: eventId
    };

    return this.http.post(url, body).toPromise()
      .then(
        (res) => {
          const eventBody = res.json();
          console.log('[EventService][enroll][success]', eventBody);
          return true;
        })
      .catch(
        (error) => {
          console.log('[EventService][enroll][error]', error);
          return false;
        });
  }

  /**
   * Perform an HTTP DELETE to REST API to withdraw enrollment to an event
   * @param eventid
   * @returns enrollment message
   */
  withdrawEnrollment(eventId, userId): Promise<boolean>{
    const url = `${this.BASE_URL}/enrollments/${eventId}/${userId}`;

    return this.http.delete(url).toPromise()
      .then(
        (res) => {
          const respondMessage = res.json();
          console.log('[EventService][withdrawEnrollment][success]', respondMessage);
          return true;
        })
      .catch(
        (error) => {
          console.log('[EventService][withdrawEnrollment][error]', error);
          return false;
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

