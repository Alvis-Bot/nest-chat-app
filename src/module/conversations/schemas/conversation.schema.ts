import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { BaseSchema } from '../../../shared/schemas/base.schema';
import { User } from '../../users/schemas/user.schema';
import { Message } from '../../messages/schemas/messsage.schema';

export type ConversationDocument = HydratedDocument<Conversation>;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  collection: 'conversations',
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.__v;
    },
  },
})
export class Conversation extends BaseSchema {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  creator: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  recipient: User;


  // Virtual field for the last message
  lastMessage: Message;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);

ConversationSchema.virtual('lastMessage', {
  ref: 'Message',
  localField: '_id',
  foreignField: 'conversation',
  justOne: true,
  options: { sort: { created_at: -1 } },
});