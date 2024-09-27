import { Module } from '@nestjs/common';
import { FriendRequestsController } from './friend-requests.controller';
import { FriendRequestsService } from './friend-requests.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  FriendRequest,
  FriendRequestSchema,
} from './schemas/friend-request.schema';
import { FriendsModule } from "../friends/friends.module";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [
    UsersModule,
    FriendsModule,
    MongooseModule.forFeature([
      {
        name: FriendRequest.name,
        schema: FriendRequestSchema,
      },
    ]),
  ],
  controllers: [FriendRequestsController],
  providers: [FriendRequestsService],
})
export class FriendRequestsModule {}
