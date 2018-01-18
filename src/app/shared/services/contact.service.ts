import { Injectable } from '@angular/core';
import {HttpClientService} from "./http-client.service";
import {environment} from '../../../environments/environment';
import {Error} from "../models/error";

@Injectable()
export class ContactService {

  private BASE_URL = environment.baseAPI;

  constructor(private http: HttpClientService) { }
  
  sendEmail(body) {
    const url = `${this.BASE_URL}/utils/sendEmail`;

        return this.http.post(url,body).toPromise()
          .then(
            (res) => {
              const body = res.json();
              console.log('[ContactService][sendEmail][success]', body);
              return body.message;
            })
          .catch(
            (errorResponse: any) => {
              var errors = errorResponse.json().errors as Error[];
              console.log('[ContactService][sendEmail][error]', errors);
              return [errors];
            }
          )
}

  /*sendEmail2(form){
    const url = `localhost:5000/api/utils/sendEmail`;
    var body = {
      firstname: form.firstname,
      lastname: form.lastname,
      email: form.email,
      subject: form.subject,
      message: form.message
    };

    return this.http.post(url, body).toPromise()
      .then(
        (res) => {
          const Body = res.json();
          console.log('[EventService][enroll][success]', Body);
          return Body;
        })
      .catch(
        (error) => {
          console.log('[EventService][enroll][error]', error);
        });
  }*/

}
