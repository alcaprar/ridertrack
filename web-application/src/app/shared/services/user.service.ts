import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {User} from '../models/user';
import {AuthenticationService} from "../../authentication/authentication.service";
import {Observable} from "rxjs/Observable";

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
  getUser(): Promise<User>{
    return new Promise(
      (resolve, reject) => {
        let userId = this.authService.getUserId();
        console.log('[UserService][getUser]', userId);
        if(userId){
          const url = `${this.BASE_USERS_URL}${userId}`;
          this.http.get(url).toPromise()
            .then(
              (response : Response) => {
                console.log('[UserService][getUser][Success]', response.json());
                const userJson = response.json().user;
                // TODO create the user instance
                let user = new User(userJson.email, userJson.name, userJson.surname, '');
                user.id = userId;
                resolve(user);
              },
              (error: any) => {
                console.log('[UserService][getUser][Error]', error);
                resolve(null);
              });
        }else{
          resolve(null)
        }
      });
  }
}
