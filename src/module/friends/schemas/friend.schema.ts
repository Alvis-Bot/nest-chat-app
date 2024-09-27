import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from "mongoose";
import { BaseSchema } from '../../../shared/schemas/base.schema';
import { User } from "../../users/schemas/user.schema";

export type FriendDocument = HydratedDocument<Friend>;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  collection: 'friends',
  toJSON: {
    transform: (doc, ret) => {
      delete ret.__v;
    },
  },
})
export class Friend extends BaseSchema {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sender: User;  // Người gửi lời mời

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  receiver: User;  // Người nhận lời mời
}

export const FriendSchema = SchemaFactory.createForClass(Friend);
