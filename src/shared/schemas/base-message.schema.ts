import { Prop } from "@nestjs/mongoose";
import { BaseSchema } from "./base.schema";
import mongoose from "mongoose";
import { User } from "../../module/users/schemas/user.schema";


export abstract class BaseMessage extends BaseSchema {
  @Prop()
  content: string;


  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  author: User;

}