import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClientService} from "./http-client.service";
import {Router} from "@angular/router";

@Injectable()
export class RouteService {
  private BASE_URL = environment.baseAPI;
  private BASE_EVENT_URL = '/api/events';

  constructor(private http: HttpClientService, private router: Router) { }

  getRoute(eventId){
    const url = `${this.BASE_EVENT_URL}/${eventId}/route`;

    return this.http.get(url).toPromise()
      .then(
        (res)=> {
         this.getCoordinates(res);
          console.log('[RouteService][Route gotten]');
        }
      ).catch(
        (errorResponse: any) => {
          this.catchErrors(errorResponse);
        }
      );
  }

  createRoute(eventId, coordinates ){
    const url = `${this.BASE_EVENT_URL}/${eventId}/route`;

    return this.http.post(url, coordinates).toPromise()
      .then(
        (res)=> {
          this.getCoordinates(res);
          console.log('[RouteService][Route created]');
        }
      ).catch(
        (errorResponse: any) => {
          this.catchErrors(errorResponse);
        }
      );
  }

  updateRoute(eventId, coordinates){
    const url = `${this.BASE_EVENT_URL}/${eventId}/route`;

    return this.http.put(url, coordinates).toPromise()
      .then(
        (res) => {
          this.getCoordinates(res);
          console.log('[RouteService][Route updated]');
        }
      ).catch(
        (errorResponse: any) => {
          this.catchErrors(errorResponse);
        }
      );
  }

  deleteRoute(eventId){
    const url = `${this.BASE_EVENT_URL}/${eventId}/route`;

    return this.http.delete(url).toPromise()
      .then((res)=> {
      this.getCoordinates(res);
        console.log('[RouteService][Route deleted]');
      }).catch(
        (errorResponse: any) => {
          this.catchErrors(errorResponse);
        }
      );
  }

  private getCoordinates(result){
    const body = result.json();
    const coordinates = body.coordinates as [{lat:number , lng: number}];
    console.log('[RouteService][getCoordinates][success]', body);
    return [null, coordinates];
  }

  private catchErrors(err){
    var errors = err.json().errors as Error[];
    console.log('[RouteService][CatchError][error]', errors);
    return [errors];
  }

}
