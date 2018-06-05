import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { User } from '../models/User';
import { AuthData } from '../models/authData.model';
import { auth } from 'firebase/app';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class AuthService {
   private user: Observable<User>;
   authChanged = new Subject<boolean>();
   public isAuthenticated = false;
   authState: any = null;

  constructor(
    private afAuth: AngularFireAuth,
    private afStore: AngularFirestore,
    private router: Router
  ) {
    // tslint:disable-next-line:no-shadowed-variable
    this.afAuth.authState.subscribe((auth) => {
      return this.authState = auth;
    });
      //// Get auth data, then get firestore user document || null
      this.user = this.afAuth.authState
        .switchMap(user => {
          if (user) {
            return this.afStore.doc<User>(`users/${user.uid}`).valueChanges();
          } else {
            return Observable.of(null);
          }
        });
  }

  // get authenticated(): boolean {
  //   return this.authState != null;
  // }
  // get currentUser(): any {
  //   return this.authenticated ? this.authState : null;
  // }
  // get currentUserObservable(): any {
  //   return this.afAuth.authState;
  // }
  // get currentUserId(): string {
  //   return this.authenticated ? this.authState.uid : '';
  // }

  login() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
    .then((credential) => {
      this.updateUserData(credential.user);
      console.log(credential);
      });
}
private updateUserData(user) {
  // Sets user data to firestore on login
  const userRef: AngularFirestoreDocument<any> = this.afStore.doc(`users/${user.uid}`);

  const data: User = {
    uid: user.uid,
    email: user.email,
    name: user.displayName,
    userName: user.displayName.split(' ')[0],
    photoUrl: user.photoURL,
  };
return userRef.set(data, { merge: true });

}

  logout() {
    return this.afAuth.auth.signOut();
  }

  authListener() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.isAuthenticated = true;
        this.authChanged.next(true);
        this.router.navigate(['/']);
      } else {
        this.authChanged.next(false);
        this.router.navigate(['/createpost']);
        this.isAuthenticated = false;
      }
    });
  }

  getCurrentUser() {
    let currentUser;
    return currentUser = firebase.auth().currentUser;
  }

}
