import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';

@Injectable()
export class HttpClientService {

  constructor(private http: Http) {}

  createAuthorizationHeader(headers: Headers) {
    var token = localStorage.getItem('TOKEN');
    if(token){
      headers.append('Authorization', 'JWT ' + token);
    }

  }

  get(url) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.get(url, {
      headers: headers
    });
  }

  post(url, data) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.post(url, data, {
      headers: headers
    });
  }

  put(url, data){
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.put(url, data, {
      headers: headers
    });
  }
  
  delete(url){
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.delete(url, {
      headers: headers
    });
  }
}
