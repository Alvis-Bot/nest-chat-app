import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseSchema } from '../../../shared/schemas/base.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  collection: 'users',
  toJSON: {
    transform: (doc, ret) => {
      delete ret.__v;
    },
  },
})
export class User extends BaseSchema {
  @Prop()
  full_name: string;

  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop()
  refresh_token: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
