import { Types } from 'mongoose';

export type INotification = {
      recipient: Types.ObjectId;
      sender?: Types.ObjectId;
      type:
            | 'info'
            | 'warning'
            | 'success'
            | 'error'
            | 'comment'
            | 'like'
            | 'follow'
            | 'post'
            | 'reply'
            | 'report'
            | 'warning'
            | 'new_post_from_following'
            | 'new_follower'
            | 'comment_reply';
      recipientRole: 'admin' | 'user';
      postId?: string;
      commentId?: string;
      title: string;
      message: string;
      link?: string;
      read: boolean;
};
