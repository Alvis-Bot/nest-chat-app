import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';

import { InjectModel } from '@nestjs/mongoose';
import { Session } from './schemas/sesstion.schema';
import { ObjectId } from "mongodb";

@Injectable()
export class SessionsService {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<Session>,
  ) {}

  getAllSessionsByUser(_id: Types.ObjectId) {
    return this.sessionModel
      .find({
        'session.passport.user._id': _id,
      })
      .exec();
  }

  async findOneBySignedCookie(signedCookie: string)  {
    return this.sessionModel.findOne({
      _id: signedCookie,
    }).exec();
  }
}
