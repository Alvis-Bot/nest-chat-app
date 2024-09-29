import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { BaseSchema } from "../../../shared/schemas/base.schema";
import { User } from "../../users/schemas/user.schema";
import { UserAgent } from "nestjs-fingerprint";

export type SessionDocument = HydratedDocument<Session>;


type Device = {
  family: string;
  version: string;
}

type Browser = {
  family: string;
  version: string;
}

type Os = {
  family: string;
  major: string;
  minor: string;
}

@Schema({
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  },
  collection: "sessions",
  toJSON: {
    transform: (doc, ret) => {
      delete ret.__v;
    }
  }
})
export class Session extends BaseSchema {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: User;

  @Prop({ required: false })
  fcmToken: string;

  @Prop({  type: Object })
  userAgent: UserAgent;

  @Prop()
  fingerprint: string;

  @Prop()
  ipAddress: string;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
