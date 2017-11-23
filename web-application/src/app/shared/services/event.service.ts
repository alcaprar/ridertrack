import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {Event} from '../models/event';
import {Observable} from 'rxjs/Observable';
import {EventToCreate} from "../models/eventToCreate";
import {HttpClientService} from "./http-client.service";
import {environment} from '../../../environments/environment'
import {User} from "../models/user";

@Injectable()
export class EventService {

  private BASE_URL = environment.baseAPI;
  private BASE_EVENT_URL = environment.baseAPI + '/events';

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
  getAllEvents(): Promise<Event[]> {
    const url = `${this.BASE_EVENT_URL}`;

    return this.http.get(url).toPromise()
        .then( (res) => {
          const eventsBody = res.json().events as Event[];
          console.log('[EventService][getAllEvents][success]', eventsBody);
         return eventsBody;
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
    const url = `${this.BASE_EVENT_URL}?sort=startingDate=asc&page=1&itemsPerPage=7`;

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

    // unset the logo field only for now
    event.logo = null;

    return this.http.post(url, event).toPromise()
      .then(
        (res) => {
          const eventBody = res.json().event as Event;
          console.log('[EventService][creteEvent][success]', eventBody);
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
   * Perform an HTTP PUT request to REST API to update a certain event   *
   * @param id of the event
   * @param {Event} data of the event
   * @returns {Promise<Event>} of the event updated
   */
  updateEvent(id, event: Event): Promise<Event> {
    const url = `${this.BASE_EVENT_URL}/${id}`;
    return this.http.put(url , JSON.stringify(event)).toPromise()
        .then(() => event)
      .catch(error => {
          console.log('[EventService][updateEvent][error]', error);
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



}

