import { INestApplication } from '@nestjs/common';
import * as compression from 'compression';
import helmet from 'helmet';

export function middleware(app: INestApplication): INestApplication {
  // Dùng để nén dữ liệu trước khi gửi về client
  app.use(compression());

  // Dùng để bảo mật ứng dụng bằng cách thiết lập các HTTP header
  app.use(helmet());

  // app.enableCors()

  return app;
}
