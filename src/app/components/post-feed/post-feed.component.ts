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

@Component({
  selector: 'app-home',
  templateUrl: './post-feed.component.html',
  styleUrls: ['./post-feed.component.scss']
})
export class PostFeedComponent implements OnInit {

  posts: Observable<any>;

  constructor(private postService: PostService,
    private authService: AuthService,
    private userService: UserService,
    private afStorage: AngularFireStorage,
    private db: AngularFirestore,
    private afAuth: AngularFireAuth) { }

  ngOnInit() {
    this.posts = this.postService.fetchAllPosts();

    function Countdown(posts) {
      let startTime = this.posts.createdDateTime;
      let endTime = this.posts.endDateTime;
      let timeLeft = startTime - endTime;
      console.log(timeLeft);
      return timeLeft;
    }
    Countdown(this.posts);
  }
    // this.postService.fetchAllPosts()
    // .subscribe(posts => {
    //   this.posts = posts;
    //   console.log(posts);
    // });
    // this.db.collection('posts').snapshotChanges().subscribe( posts => {
    //   console.log(posts);
    // });
//  }
//}
