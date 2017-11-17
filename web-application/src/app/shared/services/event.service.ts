import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import {Event} from '../models/event';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class EventService {

  private BASE_EVENT_URL = 'http://localhost:5000/api/events';

  constructor(private http: Http) {
  }

  /**
   * Perform an HTTP GET request to the REST API to read all the events
   * @returns {Promise<Event[]>}
   */
  getAllEvents(): Promise<Event[]> {
    const url = `${this.BASE_EVENT_URL}`;

    return this.http.get(url).toPromise()
        .then( (res) => {
          const eventsBody = res.json().event as Event[];
          console.log('[EventService][getAllEvents][success]', eventsBody);
         return eventsBody;
        }, (err) => {
          console.log('[EventService][getAllEvents][error]', err);
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
  createEvent(event: Event): Promise<Event> {
    const url = `${this.BASE_EVENT_URL}`;
    return this.http.post(url, JSON.stringify(event)).toPromise()
      .then((res) => {
        const eventBody = res.json().event as Event;
        console.log('[EventService][creteEvent][success]', eventBody);
        return eventBody;
      })
      .catch( error => {
        console.log('[EventService][createEvent][error]', error);
        return Promise.reject(error.message || error);
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

