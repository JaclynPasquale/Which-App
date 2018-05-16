import { User } from './User';
import { Picture } from './Picture';

export interface Post {
    $key: string;
    title?: string;
    imageUrl1: string;
    imageUrl2: string;
    authorID: User;
    authorName: User;
    voteCount1: number;
    votersID: any[];
    createdDateTime: Date;
    endDateTime: Date;
  }
