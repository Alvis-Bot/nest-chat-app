import { Controller, Get } from '@nestjs/common';
import { FirebaseService } from './firebase.service';

@Controller('firebase')
export class FirebaseController {
  constructor(private readonly firebaseService: FirebaseService) {}

  // @Get()
  // async sendNotification() {
  //   const token =
  //     'e_zd5b8_IzvgAqaxH-lqG9:APA91bHV1kgtLlnswtM0Ee9I1s0QFoBc2ykcr3t_un1iTAC_hy5zWwhkYtUQKlPaRUzQOmFsy8vHwevtmzyoms6nuXK5KHUjQe-kJEbFtLbes_Xp3V5YfoTQv8gbntf8kRe4hJ99YQUf';
  //
  //   const payload = {
  //     title: 'Hello',
  //     body: 'Hello from Firebase',
  //   };
  //   await this.firebaseService.sendNotification(token);
  // }
}
