import { Injectable } from '@angular/core';
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


@Injectable()
export class PostService {
  post$: AngularFireObject<Post>;
  posts$: AngularFireList<Post[]> = null;
  task: AngularFireUploadTask;
  percent: Observable<number>;
  snapshot: Observable<any>;
  downloadUrl: Observable<string>;
  isHovering: boolean;

constructor(private db: AngularFireDatabase, private afStorage: AngularFireStorage) {
    // this.afAuth.authState.subscribe(user => {
    //     if (user) { return this.userId = user.uid; }
    // });
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
        this.db.list(`posts/`).push({ path, size: snap.totalBytes });
        }
      })
    );
    this.downloadUrl = this.task.downloadURL();
    console.log(this.downloadUrl);
}











// getPostList(): AngularFireList<Post[]> {
//     if (!this.userId) {
//         return;
//     }
//     this.posts$ = this.db.list('posts/${this.userId}');
//     return this.posts$;
// }

// uploadFiletoStorage(event) {
//     const file = event.target.files[0];
//     const filePath = `/images/${file.name}`;
//     const task = this.afStorage.upload(filePath, file);
//     //this.uploadProgress = task.percentageChanges();
//     this.downloadUrl = task.downloadURL();
//     console.log(this.downloadUrl);
//   }
// getPostsList(): AngularFireList<Post[]> {
//     if (!this.userId) { return; }
//     this.posts$ = this.db.list('posts/${this.userId}');
//     return this.posts$;
// }

//     savePost(posts: Post[]) {
//         return this.posts$.push(posts)
//             .then(_ => console.log(this.post$));
//     }

//     // removePost(post) {
    //     const removePost = {};
    //     removePost['posts/${post.$key}'] = null;
    //     return this.db.object('/').update(removePost)
    //         .then(_ => console.log('removed'))
    //         .catch(error => console.log(error));
    // }
    // private errorHandler(error) {
    //     console.log(error);
    //     return Observable.throw(error.message);
    // }
}

