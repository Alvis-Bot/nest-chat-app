import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from 'mongoose';
import { BaseMessage } from '../../../shared/schemas/base-message.schema';
import { Conversation } from "../../conversations/schemas/conversation.schema";

export type MessageDocument = HydratedDocument<Message>;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  collection: 'messages',
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.__v;
    },
  },
})
export class Message extends BaseMessage {

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Conversation.name })
  conversation: Conversation;

}

export const MessageSchema = SchemaFactory.createForClass(Message);
