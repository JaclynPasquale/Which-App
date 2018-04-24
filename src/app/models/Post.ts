import { User } from './User';
import { Picture } from './Picture';

export interface Post {
    $key: string;
    title: string;
    imageUrl: any[];
    images: Picture[];
    authorID: User;
    authorName: User;
    voteCount: number;
    votersID: any[];
    isActive: boolean;
    createdDateTime: Date;
    endDateTime: Date;
  }
