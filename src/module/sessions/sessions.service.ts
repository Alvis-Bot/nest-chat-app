import { Injectable } from '@nestjs/common';
import { Session } from './schemas/sesstion.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IFingerprint } from 'nestjs-fingerprint';

@Injectable()
export class SessionsService {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<Session>,
  ) {}

  async updateSession(userId: any, fp: IFingerprint, fcmToken?: string) {
    console.log('updateSession', fp.userAgent);
    const session = await this.existsSession(userId, fp);
    if (session) {
      await this.sessionModel.updateOne(
        { _id: session._id },
        {
          $set: {
            fcmToken: fcmToken,
            userAgent: fp.userAgent,
            fingerprint: fp.id,
            ipAddress: fp.ipAddress.value,
          },
        },
      );
    } else {
      await this.createSession(userId, fp, fcmToken);
    }
  }

  async createSession(userId: string, fp: IFingerprint, fcmToken: string) {
    await this.sessionModel.create({
      user: userId,
      fcmToken: fcmToken,
      userAgent: fp.userAgent,
      fingerprint: fp.id,
      ipAddress: fp.ipAddress.value,
    });
  }

  async existsSession(userId: string, fp: IFingerprint) {
    return this.sessionModel.exists({
      user: userId,
      fingerprint: fp.id,
    });
  }
}
