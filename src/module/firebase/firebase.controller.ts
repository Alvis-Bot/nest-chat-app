import { Body, Controller, Post } from "@nestjs/common";
import  * as admin from "firebase-admin";

@Controller('firebase')
export class FirebaseController {

  @Post('notification')
  async sendNotification(@Body() dto: any) {
    const { token, title, body } = dto;
    await admin.messaging().send({
      token : 'e_zd5b8_IzvgAqaxH-lqG9:APA91bFq3YGbjHeTjImMMAlbPqzS77dal8v2WlfGModECaYBVv_Mj4dBNUcxyHI1ndJqSKqFNP6BNxQj5BE_UIQIVfLLa9nOAaEpxPnrevFy4qtRjTkvh3OmP2oEDNZAhKZvxs1PVthS',
      notification: {
        title: 'djkahdjkashdjkas',
        body: 'djhakjshdjkashdjkhasjkdasdasdasda'
      }
    })
  }
}
