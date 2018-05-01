import { User } from './../models/User';
import { Injectable, Input } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import { Post } from '../models/Post';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from 'angularfire2/storage';
import { NumericDictionary } from 'lodash';
import { tap } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class PostService {
  postsListChanged = new Subject<Post[]>();
  postChanged = new Subject<Post>();
  postViews: any = [];
  private posts: AngularFirestoreCollection<Post[]>;
  private post: AngularFirestoreDocument<Post>;
  task: AngularFireUploadTask;
  percent: Observable<number>;
  snapshot: Observable<any>;
  downloadUrl: Observable<string>;
  isHovering: boolean;
  @Input() user: User;

constructor(private db: AngularFirestore, private Storage: AngularFireStorage) {
}

startFileUpload(event: FileList) {
    const file = event.item(0);
    if (file.type.split('/')[0] !== 'image') {
      console.log('unsupported file type');
      return;
    }
    const path = `images/${new Date().getTime()}_${file.name}`;
    this.task = this.Storage.upload(path, file);
    this.percent = this.task.percentageChanges();
    this.downloadUrl = this.task.downloadURL();
    console.log(this.downloadUrl);
    let image;
    console.log(this.downloadUrl);
    return image = this.snapshot;
}
isUploadActive(snapshot) {
  return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
}

fetchAllPosts(): Observable<any> {
  return this.db
    .collection('posts')
    .snapshotChanges()
    .map(postArray => {
      return postArray.map(doc => {
        return{
          $key: doc.payload.doc.id,
          title: doc.payload.doc.data().title,
          authorID: doc.payload.doc.data().authorId,
          authorName: doc.payload.doc.data().authorName,
          image1: doc.payload.doc.data().imageUrl1,
          image2: doc.payload.doc.data().imageUrl2,
          voteCount1: doc.payload.doc.data().voteCount1,
          voteCount2: doc.payload.doc.data().voteCount2,
          votersID: doc.payload.doc.data().votersId,
          createdDateTime: doc.payload.doc.data().createdTime,
          endDateTime: doc.payload.doc.data().endTime,

        };
      });
    });
    // .subscribe((posts) => {
    //   this.postViews = posts;
    //   this.postsListChanged.next([...this.posts]);
    // });
}
