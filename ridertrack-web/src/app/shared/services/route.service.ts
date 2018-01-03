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

  updateRoute(eventId, coordinates, type){
    const url = `${this.BASE_EVENT_URL}/${eventId}/route`;

    return this.http.put(url, {type: type, coordinates: coordinates}).toPromise()
      .then(
        (route) => {
          let body = route.json();
          console.log('[RouteService][Route updated]', route);
          return [null,body];
        }
      ).catch(
        (err: any) => {
          this.catchErrors(err);
        }
      );
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
