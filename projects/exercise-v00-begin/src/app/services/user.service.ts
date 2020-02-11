import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth, FirebaseError, User } from 'firebase';
import { AngularFireFunctions } from '@angular/fire/functions';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnDestroy {
  userUnsubscribeFn: firebase.Unsubscribe | undefined;
  user: User | null = null;

  constructor(private firebaseAuth: AngularFireAuth, private firebaseFunctions: AngularFireFunctions) {
    this.userUnsubscribeFn = this.firebaseAuth.auth.onAuthStateChanged(
      (user) => {
        this.user = user;
    },
      (error) => console.warn(error),
      () => {
        if (this.userUnsubscribeFn) {
          this.userUnsubscribeFn();
        }
      }
    );
  }

  ngOnDestroy(): void {
    if (this.userUnsubscribeFn) {
      this.userUnsubscribeFn();
    }
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

  loginWithCredentials() {
    // TODO implement this method.
    // this.firebaseAuth.auth.signInWithEmailAndPassword(); // Use this firebase function to do the login with.
  }

  createUserWithCredentials(email: string, password: string, code: string): Promise<void> {
    return this.firebaseAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(() => {
        return this.updateUserWithCode(code)
          .then(() => console.log('updated user with code'));
      })
      .catch((error) => console.warn(error));
  }

  loginWithGoogle(code: string): Promise<void> {
    return this.firebaseAuth.auth.signInWithPopup(new auth.GoogleAuthProvider())
      .catch((error: FirebaseError) => {
        console.warn(`could not sign in with Google provider, code: ${error.code}`);
      })
      .then(() => {
        return this.updateUserWithCode(code)
          .then(() => console.log('updated user with code'));
      })
      .catch((error) => console.warn(error));
  }
}
