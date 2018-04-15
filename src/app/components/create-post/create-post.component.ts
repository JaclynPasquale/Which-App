import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { AngularFireDatabase, AngularFireObject, AngularFireList } from 'angularfire2/database';
import { UserService } from '../../services/user.service';
import { PostService } from '../../services/post.service';

import { User } from '../../models/User';
import { Post } from '../../models/Post';
import { Picture } from '../../models/Picture';

import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { getLocaleDateTimeFormat } from '@angular/common';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})

export class CreatePostComponent {
  posts$: AngularFireList<Post[]>;
  post$: AngularFireObject<Post>;
  isActive: boolean;
  createdDate: Date;
  image: Picture;
  task: AngularFireUploadTask;
  percent: Observable<number>;
  snapshot: Observable<any>;
  downloadUrl: Observable<string>;
  isHovering: boolean;
  userId: string;
  title: string;
  userName: string;



  constructor(
    private postService: PostService,
    private userService: UserService,
    private afStorage: AngularFireStorage,
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth,

  ) {
    const bindPost = db.object('post').valueChanges();
    this.afAuth.authState.subscribe(user => {
      if (user) { return this.userId = user.uid;
       }
  });
  }

startUpload(event: FileList) {
  const file = event.item(0);
  if (file.type.split('/')[0] !== 'image') {
    console.log('unsupported file type');
    return;
  }
  const path = `images/${new Date().getTime()}_${file.name}`;
  this.task = this.afStorage.upload(path, file);
  this.percent = this.task.percentageChanges();
  this.snapshot = this.task.snapshotChanges().pipe(
    tap(snap => {
      if (snap.bytesTransferred === snap.totalBytes) {
        this.db.list(`posts/${this.userId}`).push({ path});
      }
    })
  );
  this.downloadUrl = this.task.downloadURL();
  console.log(this.downloadUrl);
}


savePost(post) {
  const post$ = this.db.object('post');
  post$.set({
    title: this.title,
    imageUrls: this.downloadUrl,
    authorID: this.userId,
    authorName: this.userName,
    voteCount: 0,
    voters: [],
    isActive: true,
    createdDateTime: Date.now(),
    endDateTime: Date.now(),
  });
}



  // uploadFile(event: any ) {
  //   this.postService.uploadFiletoStorage(event);
  // }

  // savePost(post) {
  //   const createdDate = firebase.database.ServerValue.TIMESTAMP;
  //   const createdBy = this.postService.userId;
  //   this.postService.savePost(post);
  // }

  // removePost(post) {
  //   this.postService.removePost(post)
  //   .then(_ => this.router.navigate(['/post-list']));
  // }

}
