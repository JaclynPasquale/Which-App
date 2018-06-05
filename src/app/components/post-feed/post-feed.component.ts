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
import * as firebase from 'firebase';


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
    private afAuth: AngularFireAuth) {}

  ngOnInit() {
    this.posts = this.postService.fetchAllPosts();
    this.afAuth.auth.onAuthStateChanged(authState => {
        this.user = this.afAuth.auth.currentUser;
    });
  }

getAllVotersForPost(postKey) {
  return new Promise((res, rej) => {
    const allVotersRef = firebase.firestore().collection('posts').doc(postKey)
    .collection('voterIds');
    const voters = [];
    allVotersRef.get().then(result => {
      result.forEach(doc => {
        voters.push(doc.data());
      });
      res(voters);
    });
  });
}
voteFor(user, post, number) {
const votesCount = 'voteCount' + number ;
const voter = this.user;
const whichPost = firebase.firestore().collection('posts').doc(post.$key);
const allVoters = this.getAllVotersForPost(post.$key);
const voterRef = firebase.firestore().collection('posts').doc(post.$key)
                  .collection('voterIds').doc(voter.uid);

return firebase.firestore().runTransaction(function(transaction) {
    // This code may get re-run multiple times if there are conflicts.
    return transaction.get(whichPost).then(function(postDoc) {
        if (!postDoc.exists) {
            throw new Error('Document does not exist!');
        }
        return new Promise((res, rej) => {
          allVoters.then((voters: Array<any>) => {
            const allVoterIds = voters.map(v => v.voterId);
            if (allVoterIds.indexOf(voter.uid) === -1) {
              const newVotesCount = postDoc.data()[votesCount] + 1;
              transaction.update(whichPost, { votesCount: newVotesCount });
              transaction.set(voterRef, {voterId: voter.uid,
              voterName: voter.displayName});
              res(newVotesCount);
            } else {
              throw new Error('This user has already voted!');
            }
          });
        });
  });
}).then(function(newVotesCount) {
    console.log('Transaction successfully committed!', newVotesCount);
}).catch(function(error) {
    console.log('Transaction failed: ', error);
});
}

voteFor1(user, post) {

const voter = this.user;
const whichPost = firebase.firestore().collection('posts').doc(post.$key);
const allVoters = this.getAllVotersForPost(post.$key);
const voterRef = firebase.firestore().collection('posts').doc(post.$key)
                  .collection('voterIds').doc(voter.uid);

return firebase.firestore().runTransaction(function(transaction) {
    // This code may get re-run multiple times if there are conflicts.
    return transaction.get(whichPost).then(function(postDoc) {
        if (!postDoc.exists) {
            throw new Error('Document does not exist!');
        }
        return new Promise((res, rej) => {
          allVoters.then((voters: Array<any>) => {
            const allVoterIds = voters.map(v => v.voterId);
            if (allVoterIds.indexOf(voter.uid) === -1) {
              const newVoteCount1 = postDoc.data().voteCount1 + 1;
              transaction.update(whichPost, { voteCount1: newVoteCount1 });
              transaction.set(voterRef, {voterId: voter.uid,
              voterName: voter.displayName});
              res(newVoteCount1);
            } else {
              throw new Error('This user has already voted!');
            }
          });
        });
  });
}).then(function(newVoteCount1) {
    console.log('Transaction successfully committed!', newVoteCount1);
}).catch(function(error) {
    console.log('Transaction failed: ', error);
});
}
      // this.allPosts = this.postCollection.snapshotChanges().pipe(
      //   map(actions => actions.map(a => {
      //     const data = a.payload.doc.data() as Post;
      //     const id = a.payload.doc.$key;
      //     return { id, ...data };
      //   }))
      // );

  //   });
  // }

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