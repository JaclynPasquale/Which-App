import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import * as firebase from 'firebase/app';
import { User } from '../models/User';
import { List } from 'lodash';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable()
export class UserService {
  // private subject: BehaviorSubject<User> = new
  // BehaviorSubject(null);

  constructor(private db: AngularFirestore) { }

  getUser(uid: string) {
    return this.db.collection('/users/' + uid);
  }
}
