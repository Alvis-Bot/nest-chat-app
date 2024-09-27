import { Controller, Delete, Get, Param } from "@nestjs/common";
import { FriendsService } from "./friends.service";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { ApiTags } from "@nestjs/swagger";
import { AuthUser } from "../../common/decorators/auth.decorator";
import { User } from "../users/schemas/user.schema";
import { ValidateMongoId } from "../../common/pipes/parse-object-id.pipe";
import { Types } from "mongoose";
import { ApiEndpoint } from "../../common/decorators/http.decorator";

@ApiTags('friends')
@Controller('friends')
export class FriendsController {

  constructor(
    private readonly friendsService: FriendsService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @ApiEndpoint()
  @Get()
  getFriends(@AuthUser() user: User) {
    console.log('Fetching Friends');
    return this.friendsService.findFriends(user._id);
  }

  @ApiEndpoint()
  @Delete(':id/delete')
  async deleteFriend(
    @AuthUser() { _id: userId }: User,
    @Param('id', ValidateMongoId) id: string,
  ) {
    const friend_id = Types.ObjectId.createFromHexString(id);
    const friend = await this.friendsService.deleteFriend(friend_id, userId);
    this.eventEmitter.emit('friend.delete', { friend, userId });
    return friend;
  }


}
