import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import {Event} from '../models/event';

@Injectable()
export class EventService {

  private BASE_URL = 'http://localhost:5000/api';

  currentEvent: Event;
  eventList: Event[];

  constructor(private http: Http) {
  }

    /**
   *returns the list of all the events after an HTTP GET and store the result inside an array
   * of events: "eventList"
   * @returns {Promise<any>}
   */
  getAllEvents(): Promise<any> {
    const url = `${this.BASE_URL}/events`;

    return new Promise((resolve, reject) => {
      this.http.get(url)
        .map(res => res.json())
        .subscribe(res => {
          console.log('[EventService][getAllEvents][success]', res);
          const body = res.json();
          this.eventList = body.event;
          localStorage.setItem('eventList', JSON.stringify(this.eventList));
        }, (err) => {
          console.log('[EventService][getAllEvents][error]', err);
          reject(err);
        });
    });
  }

  /**
   * get a specific event by id, performing an HTTP GET to the api server and storing the result
   * in the currentEvent
   * @param id
   * @returns {Promise<any>}
   */
  getEvent(id): Promise<any> {
    const url = `${this.BASE_URL}/events/`;
    return this.http.get (url + id).toPromise()
        .then((res) => {
          const body = res.json();
          return body.event;
        })
      .catch(error => {
        console.log('[EventService][getEvent][error]', error);
        return Promise.reject(error.message || error);
      });
  }

  updateEvent(id, data: Event) {
    const url = `${this.BASE_URL}/events/`;
    return new Promise((resolve, reject) => {
      this.http.put(url + id, data)
        .map(res => res.json())
        .subscribe(res => {
          console.log('[EventService][updateEvent][succes]', res);
          resolve(res);
        }, (err) => {
          console.log('[EventService][updateEvent][error]', err);
          reject(err);
        });
    });
  }

  deleteEvent(id): Promise<any> {
    const url = `${this.BASE_URL}/events/`;
    return new Promise((resolve, reject) => {
      this.http.delete(url + id)
        .map(res => res.json())
        .subscribe(res => {
          console.log('[EventService][deleteEvent][success]', res);
          resolve(res);
        }, (err) => {
          console.log('[EventService][deleteEvent][error]', err);
          reject(err);
        });
    });
  }
}

