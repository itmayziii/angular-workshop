import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth, User } from 'firebase';
import { AngularFireFunctions } from '@angular/fire/functions';
import * as firebase from 'firebase';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnDestroy {
  private userUnsubscribeFn: firebase.Unsubscribe | undefined;
  private checkUserLoginUnsubscribeFn: firebase.Unsubscribe | undefined;
  private isLoginCheckFinished = false;
  // Current user being observed.
  // undefined = Firebase is not done determining if user is logged in or not.
  // null = User is not logged in.
  currentUserSubject = new BehaviorSubject<User|null|undefined>(undefined);

  constructor(private firebaseAuth: AngularFireAuth, private firebaseFunctions: AngularFireFunctions) {
    this.userUnsubscribeFn = this.firebaseAuth.auth.onAuthStateChanged(
      (user) => {
        this.currentUserSubject.next(user);
        this.isLoginCheckFinished = true;
      },
      (error) => console.warn(error)
    );
  }

  ngOnDestroy(): void {
    if (this.userUnsubscribeFn) {
      this.userUnsubscribeFn();
    }
    if (this.checkUserLoginUnsubscribeFn) {
      this.checkUserLoginUnsubscribeFn();
    }
  }

  updateUserWithCode(code: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const addCodeSubscription = this.firebaseFunctions.httpsCallable('addCode')({ code })
        .subscribe(
          () => resolve(true),
          (error) => reject(error),
          () => {
            addCodeSubscription.unsubscribe();
          }
        );
    });
  }

  loginWithCredentials(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return this.firebaseAuth.auth.signInWithEmailAndPassword(email, password);
  }

  createUserWithCredentials(email: string, password: string, code: string): Promise<void> {
    return this.firebaseAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(() => {
        return this.updateUserWithCode(code)
          .then(() => console.log('updated user with code'));
      })
      .catch((error) => console.warn(error));
  }

  createUserThroughGoogle(code: string): Promise<firebase.auth.UserCredential> {
    return this.firebaseAuth.auth.signInWithPopup(new auth.GoogleAuthProvider())
      .then((userCredential) => {
        return this.updateUserWithCode(code)
          .then(() => userCredential);
      });
  }

  loginWithGoogle(): Promise<firebase.auth.UserCredential> {
    return Promise.resolve(this.firebaseAuth.auth.signInWithPopup(new auth.GoogleAuthProvider()));
  }
}

/**
 * Type guard to know whether or not a user object is at least potentially a user object and not undefined which means we are still
 * waiting to know if a user is logged in or not. https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards
 */
export function isPotentialUser(user: User|null|undefined): user is User|null {
  return user !== undefined;
}
