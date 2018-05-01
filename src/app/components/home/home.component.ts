import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { AngularFireStorage } from 'angularfire2/storage';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private postService: PostService,
    private authService: AuthService,
    private userService: UserService,
    private afStorage: AngularFireStorage,
    private db: AngularFirestore,
    private afAuth: AngularFireAuth) { }

  ngOnInit() {
    this.db.collection('posts').snapshotChanges().subscribe( posts => {
      console.log(posts);
    });
  }


}
