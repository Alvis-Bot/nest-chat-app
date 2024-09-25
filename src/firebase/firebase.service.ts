import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'node:path';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../shared/types';

@Injectable()
export class FirebaseService {
  private defaultApp: admin.app.App;

  constructor(private readonly configService: ConfigService<AllConfigType>) {
    console.info('Firebase Admin SDK initialized');
    //read file json from firebase
    this.defaultApp = admin.initializeApp(
      {
        credential: admin.credential.cert(
          path.resolve(
            __dirname,
            '../../',
            this.configService.get('app.firebase_sdk_path', { infer: true }),
          ),
        ),
      },
      'default',
    );
  }

  getMessaging() {
    return this.defaultApp.messaging();
  }

  /**
   * Send notification to device
   * @param token
   */
  async sendNotification(token: string) {
    const TOPIC_NAME = 'industry-tech';
    const message: admin.messaging.Message = {
      token: token,
      notification: {
        title: 'Hello',
        body: 'Hello from Firebase',
      },
      data: {
        score: '850',
        time: '2:45',
      },
      android: {
        notification: {
          imageUrl: 'https://foo.bar.pizza-monster.png',
        },
      },
      apns: {
        payload: {
          aps: {
            'mutable-content': 1,
          },
        },
        fcmOptions: {
          imageUrl: 'https://foo.bar.pizza-monster.png',
        },
      },
      webpush: {
        headers: {
          image: 'https://foo.bar.pizza-monster.png',
        },
      },
    };

    this.getMessaging()
      .send(message)
      .then((response) => {
        console.log('Successfully sent message:', response);
      })
      .catch((error) => {
        console.log('Error sending message:', error);
      });
  }
}
