import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { AngularFireDatabase, AngularFireObject, AngularFireList } from 'angularfire2/database';
import { UserService } from '../../services/user.service';
import { PostService } from '../../services/post.service';
import * as firebase from 'firebase';

import { User } from '../../models/User';
import { Post } from '../../models/Post';
import { Picture } from '../../models/Picture';

import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { getLocaleDateTimeFormat, PopStateEvent } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})

export class CreatePostComponent {
  posts$: AngularFirestoreCollection<Post[]>;
  post$: AngularFirestoreDocument<Post>;
  isUploadActive: boolean;
  createdDate: Date;
  image: Picture;
  task: AngularFireUploadTask;
  percentage: Observable<number>;
  snapshot: Observable<any>;
  private _downloadUrls = [new BehaviorSubject<string>(''), new BehaviorSubject<string>('')];
  downloadUrl1 = this._downloadUrls[0] as Observable<string>;
  downloadUrl2 = this._downloadUrls[1] as Observable<string>;
  imageUrl: string;
  isHovering: boolean;
  userId: string;
  title: string;
  userName: string;
  authorID;
  authorName: string;
  voteCount: 0;
  voters: any[];
  createdDateTime;
  endDateTime;

  constructor(
    private postService: PostService,
    private authService: AuthService,
    private userService: UserService,
    private afStorage: AngularFireStorage,
    private db: AngularFirestore,
    private afAuth: AngularFireAuth,
  ) {}

  toggleHover(event: boolean) {
    this.isHovering = event;
  }


  startUpload(event: FileList, imageNumber: number) {
    // The File object
    const file = event.item(0);

    // Client-side validation example
    if (file.type.split('/')[0] !== 'image') {
      console.error('unsupported file type :( ');
      return;
    }
    const path = `/${new Date().getTime()}_${file.name}`;
    this.task = this.afStorage.upload(path, file);
    this.percentage = this.task.percentageChanges();
    this.snapshot   = this.task.snapshotChanges().pipe(
      tap(snap => {
        if (snap.bytesTransferred === snap.totalBytes) {
          this.db.collection('photos').add( { path, size: snap.totalBytes });
        }
      })
    );
    this.task.downloadURL().subscribe(downloadUrl => {
      this._downloadUrls[imageNumber].next(downloadUrl);
    });
 }

    // Determines if the upload task is active
  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }

  savePost(posts) {
    const authorID = this.authService.getCurrentUser().uid;
    const imageUrl1 = this._downloadUrls[0].getValue();
    const imageUrl2 = this._downloadUrls[1].getValue();
    const createdDateTime = new Date();
    const endDateTime = new Date(createdDateTime.getTime() + 15 * 60000);
    const voteCount1 = 0;
    const voteCount2 = 0;
    const title = '';

    this.db.collection('posts').add({
      authorID, imageUrl1, imageUrl2, createdDateTime, endDateTime, voteCount1, voteCount2, title })
    .then(function(docRef) {
      const postID = docRef.id;
  });
  }
}

