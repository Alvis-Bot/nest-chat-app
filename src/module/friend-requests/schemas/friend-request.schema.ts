import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { BaseSchema } from '../../../shared/schemas/base.schema';
import { User } from '../../users/schemas/user.schema';

export type FriendRequestDocument = HydratedDocument<FriendRequest>;

export enum FriendRequestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  collection: 'friend_requests',
  toJSON: {
    transform: (doc, ret) => {
      delete ret.__v;
    },
  },
})
export class FriendRequest extends BaseSchema {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sender: User; // Người gửi lời mời

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  receiver: User; // Người nhận lời mời

  @Prop({ type: String, default: 'Send you a friend request.' })
  description: string; //= 'Send you a friend request.'

  @Prop({
    type: String,
    enum: FriendRequestStatus,
    default: FriendRequestStatus.PENDING,
  })
  status: FriendRequestStatus;
}

export const FriendRequestSchema = SchemaFactory.createForClass(FriendRequest);
