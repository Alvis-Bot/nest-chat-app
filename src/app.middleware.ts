import { INestApplication } from '@nestjs/common';
import * as compression from 'compression';
import helmet from 'helmet';
import { ConfigService } from "@nestjs/config";
import { AllConfigType } from "./shared/types";
import * as cookieParser from 'cookie-parser';
import * as admin from "firebase-admin";

export function middleware(app: INestApplication): INestApplication {
  // Dùng để nén dữ liệu trước khi gửi về client
  app.use(compression());

  const configService = app.get(ConfigService);
  // Dùng để bảo mật ứng dụng bằng cách thiết lập các HTTP header

  app.use(helmet());

  app.enableCors({
    origin : true,
    credentials: true,
  });

  app.use(cookieParser());

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: configService.get("FIREBASE_PROJECT_ID"),
      privateKey: configService.get('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n'),
      clientEmail: configService.get('FIREBASE_CLIENT_EMAIL'),
    }),
  });


  return app;
}
