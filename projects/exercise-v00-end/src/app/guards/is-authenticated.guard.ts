import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { isPotentialUser, UserService } from '../services/user.service';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IsAuthenticatedGuard implements CanActivateChild {
  constructor(private userService: UserService, private router: Router) {
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let currentUserSubscription: Subscription;
    return new Promise<boolean | UrlTree>((resolve, reject) => {
      currentUserSubscription = this.userService.currentUserSubject
        .pipe(
          filter(isPotentialUser)
        )
        .subscribe(
          (currentUser) => {
            if (currentUser === null) {
              return resolve(this.router.createUrlTree(['login']));
            }

            return resolve(true);
          },
          (error) => {
            console.warn(error);
            reject(error);
          }
        );
    }).then((val) => {
      currentUserSubscription.unsubscribe();
      return val;
    });
  }
}
