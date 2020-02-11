import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth, User } from 'firebase';
import { AngularFireFunctions } from '@angular/fire/functions';
import * as firebase from 'firebase';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnDestroy {
  private userUnsubscribeFn: firebase.Unsubscribe | undefined;
  private checkUserLoginUnsubscribeFn: firebase.Unsubscribe | undefined;
  user: User | null = null;
  userSubject: Subject<User | null> = new Subject<User|null>();
  private isLoginCheckFinished = false;

  constructor(private firebaseAuth: AngularFireAuth, private firebaseFunctions: AngularFireFunctions) {
    this.userUnsubscribeFn = this.firebaseAuth.auth.onAuthStateChanged(
      (user) => {
        this.userSubject.next(user);
        this.user = user;
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

  checkIfLoginFinished(): Promise<boolean> {
    if (this.isLoginCheckFinished) { return Promise.resolve(true); }

    return new Promise<boolean>((resolve, reject) => {
       this.checkUserLoginUnsubscribeFn = this.firebaseAuth.auth.onAuthStateChanged(
        (user) => {
          this.isLoginCheckFinished = true;
          resolve(true);

          if (this.checkUserLoginUnsubscribeFn) {
            this.checkUserLoginUnsubscribeFn();
          }
        },
        (error) => reject(error)
      );
    });
  }

  // NOT PART OF THE WORKSHOP ;)
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
