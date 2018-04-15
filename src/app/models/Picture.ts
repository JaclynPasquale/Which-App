import { User } from './User';

export interface Picture {

    $key: string;
    uploadProgress: number;
    file: File;
    name: string;
    imageUrl: string;
    uploadedBy: User;
    sequenceNumber: number;
    isActive: boolean;
    createdDate: Date;
  }
