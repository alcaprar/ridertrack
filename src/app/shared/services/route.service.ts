import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClientService} from "./http-client.service";
import {Router} from "@angular/router";

@Injectable()
export class RouteService {
  private BASE_EVENT_URL = '/api/events';

  constructor(private http: HttpClientService, private router: Router) { }

  getRoute(eventId){
    const url = `${this.BASE_EVENT_URL}/${eventId}/route`;

    return this.http.get(url).toPromise()
      .then(
        (route)=> {
          console.log('[RouteService][getRoute][success]', route);
          const body = route.json();
          console.log('[RouteService][getRoute] coordinates', body.coordinates);
          console.log('[RouteService][getRoute] type', body.type);
          return body;
        }
      ).catch(
        (err) => {
          this.catchErrors(err);
        }
      );
  }

  /**
   * It calls the endpoint in backend in order to update the route.
   * It also passes the new length of the route.
   * @param eventId
   * @param coordinates
   * @param type
   * @param length
   * @returns {any|Promise<T>}
     */
  updateRoute(eventId, coordinates, type, length){
    const url = `${this.BASE_EVENT_URL}/${eventId}/route`;

    return new Promise((resolve, reject) =>{
      this.http.put(url, {type: type, coordinates: coordinates, length: length}).toPromise()
        .then(
          (response) => {
            let body = response.json();
            console.log('[RouteService][Route updated]', body);
            resolve(body);
          }
        ).catch(
        (response) => {
          let body = response.json();
          let errors = body.errors as Error[];
          reject(errors)
        }
      );
    });
  }

  deleteRoute(eventId){
    const url = `${this.BASE_EVENT_URL}/${eventId}/route`;

    return this.http.delete(url).toPromise()
      .then((res)=> {
      let body = res.json();
        console.log('[RouteService][Route deleted]');
        return [null, body];
      }).catch(
        (errorResponse: any) => {
          this.catchErrors(errorResponse);
        }
      );
  }


  private catchErrors(err){
    var errors = err.json().errors as Error[];
    console.log('[RouteService][CatchError][error]', errors);
    return errors[0];
  }

}
