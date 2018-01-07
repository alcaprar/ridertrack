import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from "../../authentication/authentication.service";

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthenticationService) { }
  canActivate() {
    console.log('[ADMIN GUARD]'+this.authService.getUserRole());
    if (this.authService.getUserRole() === 'administrator') {
      return true;
    }
    return false;
  }
}
