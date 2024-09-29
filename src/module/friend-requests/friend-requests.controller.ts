import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AuthUser } from '../../common/decorators/auth.decorator';
import { User } from '../users/schemas/user.schema';
import { ApiEndpoint } from '../../common/decorators/http.decorator';
import { FriendCreateDto } from './dto/friend-create.dto';
import { FriendRequestsService } from './friend-requests.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ApiTags } from '@nestjs/swagger';
import { ValidateMongoId } from '../../common/pipes/parse-object-id.pipe';
import { Types } from 'mongoose';

@ApiTags('friend-requests')
@Controller('friend-requests')
export class FriendRequestsController {
  constructor(
    private friendRequestsService: FriendRequestsService,
    private eventEmitter: EventEmitter2,
  ) {}

  @ApiEndpoint()
  @Post()
  async createFriendRequest(
    @AuthUser() user: User,
    @Body() dto: FriendCreateDto,
  ) {
    const friendRequest = await this.friendRequestsService.createFriendRequest(
      user,
      dto,
    );
    this.eventEmitter.emit('friend-request.create', friendRequest);
    return friendRequest;
  }

  @ApiEndpoint()
  @Get()
  getFriendRequests(@AuthUser() user: User) {
    return this.friendRequestsService.getFriendRequests(user._id);
  }

  @ApiEndpoint()
  @Patch(':id/accept')
  async acceptFriendRequest(
    @AuthUser() { _id: user_id }: User,
    @Param('id', ValidateMongoId) friend_request_id: Types.ObjectId,
  ) {
    console.log('id', friend_request_id);
    const response = await this.friendRequestsService.accept(
      friend_request_id,
      user_id,
    );
    this.eventEmitter.emit('friend-request.accept', response);
    return response;
  }

  @ApiEndpoint()
  @Delete(':id/cancel')
  async cancelFriendRequest(
    @AuthUser() { _id: user_id }: User,
    @Query('id', ValidateMongoId) id: string,
  ) {
    const friend_request_id = Types.ObjectId.createFromHexString(id);
    const response = await this.friendRequestsService.cancel(
      friend_request_id,
      user_id,
    );
    this.eventEmitter.emit('friend-request.cancel', response);
    return response;
  }

  @ApiEndpoint()
  @Patch(':id/reject')
  async rejectFriendRequest(
    @AuthUser() { _id: user_id }: User,
    @Param('id', ValidateMongoId) id: string,
  ) {
    const friend_request_id = Types.ObjectId.createFromHexString(id);
    const response = await this.friendRequestsService.reject(
      friend_request_id,
      user_id,
    );
    this.eventEmitter.emit('friend-request.reject', response);
    return response;
  }

  @ApiEndpoint({
    isPublic: true,
  })
  @Post('random')
  random(@AuthUser() { username }: User) {
    return this.friendRequestsService.sendRandomFriendRequest(username);
  }

  @ApiEndpoint()
  @Patch('accept-all')
  acceptAllFriendRequests(@AuthUser() user: User) {
    return this.friendRequestsService.acceptAllFriendRequests();
  }
}
