import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from "mongoose";
import { BaseSchema } from '../../../shared/schemas/base.schema';
import MongoStore from 'connect-mongo';
import { Transform } from "class-transformer";
import { User } from "../../users/schemas/user.schema";
import { Cookie } from "express-session";

export type UserDocument = HydratedDocument<Session>;

type SessionData = {
  cookie: Cookie;
  passport: {
    user: User;
  };
};

@Schema({
  collection: 'sessions',
  toJSON: {
    transform: (doc, ret) => {
      delete ret.__v;
    },
  },
})
export class Session {

  @Prop( { type: String })
  _id?: string


  @Prop({ type: Object  })
  session: SessionData;

  @Prop()
  expires: Date;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
