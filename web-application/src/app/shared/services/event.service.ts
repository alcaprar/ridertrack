import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import {Event} from '../models/event';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class EventService {

  private BASE_URL = 'http://localhost:5000/api';

  constructor(private http: Http) {
  }

  /**
   * Perform an HTTP GET request to the REST API to read all the events
   * @returns {Promise<any>}
   */
  getAllEvents(): Observable<Event[]> {
    const url = `${this.BASE_URL}/events`;

    return this.http.get(url)
        .map( (res) => {
          console.log('[EventService][getAllEvents][success]', res);
          const body = res.json();
          return body.event;
        }, (err) => {
          console.log('[EventService][getAllEvents][error]', err);
          return Observable.of(null);
        });
  }

  /**
   * Perform an HTTP GET request to the REST API to read a specific event by id   *
   * @param id
   * @returns {Promise<any>} of the event
   */
  getEvent(id): Promise<any> {
    const url = `${this.BASE_URL}/events/`;
    return this.http.get(url + id).toPromise()
      .then((res) => {
        const body = res.json();
        return body.event;
      })
      .catch(error => {
        console.log('[EventService][getEvent][error]', error);
        return Promise.reject(error.message || error);
      });
  }

  /**
   * Perform an HTTP POST to REST API to create an event
   * @param {Event} event
   * @returns {Promise<any>} of the event
   */
  createEvent(event: Event): Promise<any> {
    const url = `${this.BASE_URL}/events/`;
    return this.http.post(url, JSON.stringify(event)).toPromise()
      .then((res) => {
        const body = res.json();
        console.log('[EventService][creteEvent][success]', body.data);
        return body.event;
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
   * @returns {Promise<any>} of the event updated
   */
  updateEvent(id, data: Event) {
    const url = `${this.BASE_URL}/events/`;
    return new Promise((resolve, reject) => {
      this.http.put(url + id, data)
        .subscribe(res => {
          const body = res.json();
          console.log('[EventService][updateEvent][succes]', body);
          resolve(body.event);
        }, (err) => {
          console.log('[EventService][updateEvent][error]', err);
          reject(err);
        });
    });
  }

  /**
   * Perform an HTTP DELETE request to REST API to delete a certain event
   * @param id of the event
   * @returns {Promise<any>} of the event deleted
   */
  deleteEvent(id): Promise<any> {
    const url = `${this.BASE_URL}/events/`;
    return new Promise((resolve, reject) => {
      this.http.delete(url + id)
        .subscribe(res => {
          const body = res.json();
          console.log('[EventService][deleteEvent][success]', body.event);
          resolve(body.event);
        }, (err) => {
          console.log('[EventService][deleteEvent][error]', err);
          reject(err);
        });
    });
  }

}

