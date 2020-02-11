import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class IsAuthenticatedGuard implements CanActivateChild {
  constructor(private userService: UserService, private router: Router) {
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.userService.checkIfLoginFinished()
      .then(() => {
        if (!this.userService.user) {
          return this.router.createUrlTree(['login']);
        }

        return true;
      }).catch((error) => {
        console.warn(error);
        return this.router.createUrlTree(['login']);
      });
  }
}
