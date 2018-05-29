import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { AngularFireStorage } from 'angularfire2/storage';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Post } from '../../models/Post';
import { forEach } from '@firebase/util';
import { Subscription } from 'rxjs/Subscription';
import { auth } from 'firebase/app';
import { snapshotChanges } from 'angularfire2/database';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './post-feed.component.html',
  styleUrls: ['./post-feed.component.scss']
})
export class PostFeedComponent implements OnInit {

  postCollection: any;
  allPosts: AngularFirestoreCollection<{}>;
  posts: Observable<any>;
  user;

  constructor(private postService: PostService,
    private authService: AuthService,
    private userService: UserService,
    private afStorage: AngularFireStorage,
    private db: AngularFirestore,
    private afAuth: AngularFireAuth) {

      // private endTime: Date;
      // private futureString: string;
      // private timeLeft: number;
      // private $counter: Observable<number>;
      // private subscription: Subscription;
      // private message: string;
    }

  ngOnInit() {
    this.posts = this.postService.fetchAllPosts();
    this.user = this.afAuth.auth.currentUser;
    console.log(this.user);
  }
  voteFor1(user, post) {
    console.log(user);
    console.log(post);
    const voter = this.user;
    const whichpost = this.db.collection('posts').doc(post.$key);
    const postCollection = this.db.collection('posts');
    const postValues = whichpost.snapshotChanges();
    postValues.subscribe((v: any) => {
      whichpost.update({
        'voteCount1': ++v.voteCount1,
        'voterID': voter.uid
      });
      this.allPosts = this.postCollection.snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Post;
          const id = a.payload.doc.$key;
          return { id, ...data };
        }))
      );

    });
  }

  //   function Countdown(posts) {
  //     let startTime = this.posts.createdDateTime;
  //     let endTime = this.posts.endDateTime;
  //     let timeLeft = startTime - endTime;
  //     console.log(timeLeft);
  //     return timeLeft;
  //   }
  //   Countdown(this.posts);
  // }
    // this.postService.fetchAllPosts()
    // .subscribe(posts => {
    //   this.posts = posts;
    //   console.log(posts);
    // });
    // this.db.collection('posts').snapshotChanges().subscribe( posts => {
    //   console.log(posts);
    // });
