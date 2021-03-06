import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { environment } from '../environments/environment';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';


import 'firebase/storage';
import { AngularFireModule } from 'angularfire2';
import { AngularFireStorageModule, AngularFireStorage } from 'angularfire2/storage';
import { AngularFirestoreModule, AngularFirestore } from 'angularfire2/firestore';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireAuth } from 'angularfire2/auth';

import { ClarityModule } from '@clr/angular';
import '@clr/icons';
import '@clr/icons/shapes/essential-shapes';
import '@clr/icons/shapes/social-shapes';

import { AppComponent } from './app.component';

import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { PostService } from './services/post.service';

import { PostFeedComponent } from './components/post-feed/post-feed.component';
import { AppNavbarComponent } from './components/app-navbar/app-navbar.component';
import { AuthGuard } from './guards/auth.guard';
import { CreatePostComponent } from './components/create-post/create-post.component';
import { DropZoneDirective } from './drop-zone.directive';


@NgModule({
  declarations: [
    AppComponent,

    PostFeedComponent,
    AppNavbarComponent,
    CreatePostComponent,
    DropZoneDirective,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ClarityModule,
    AngularFirestoreModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    RouterModule.forRoot([
      { path: '', component: PostFeedComponent },
      { path: 'createpost', component: CreatePostComponent},

    ])
  ],
  providers: [
    AuthService,
    UserService,
    PostService,
    AuthGuard,
    AngularFireDatabase,
    // AngularFireAuth,
    AngularFireStorage
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
