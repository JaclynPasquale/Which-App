import { Post } from './Post';

export interface User {
    uid: string;
    name: string;
    email: string;
    posts: Post[];
  }

