import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {User} from '../models/user';
import {AuthenticationService} from '../../authentication/authentication.service';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class UserService {
  private BASE_USERS_URL = 'http://localhost:5000/api/users/';

  constructor(private http: Http, private authService: AuthenticationService) {

  }

  /**
   * It returns the user detail.
   * If the user is not logged it returns null.
   * @returns {any}
   */
  getUser(): Observable<User> {
    let userId = this.authService.getUserId();
    console.log('[UserService][getUser]', userId);
    if (userId) {
      const url = `${this.BASE_USERS_URL}${userId}`;
      return this.http.get(url)
        .map(
          (response) => {
            console.log('[UserService][getUser][Success]', response.json());
            const userJson = response.json().user;
            // TODO create the user instance
            let user = new User(userJson.email, userJson.name, userJson.surname, '');
            user.id = userId;
            return user;
          },
          (error: any) => {
            console.log('[UserService][getUser][Error]', error);
            return Observable.of(null);
          });
    }else {
      return Observable.of(null);
    }
  }
}
