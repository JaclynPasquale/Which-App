import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from '../models/User';


@Injectable()
export class AuthService {
   private user: User;

  constructor(private afAuth: AngularFireAuth) {
    this.afAuth.authState
    .map(this.toUserModel)
    .subscribe(user => {
    });
  }
  login(): Promise<firebase.User> {
    return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  logout(): Promise<any> {
    return this.afAuth.auth.signOut();
  }

  authState(): Observable<User> {
    return this.afAuth.authState.map(this.toUserModel);
  }
  getUser(): User {
    return this.user;
  }

  toUserModel(firebaseUser: firebase.User): User {
    if (!firebaseUser) { return null; }
    return {
    uid: firebaseUser.uid,
    name: firebaseUser.displayName,
    email: firebaseUser.email,
    posts: [],
    };
  }
}
