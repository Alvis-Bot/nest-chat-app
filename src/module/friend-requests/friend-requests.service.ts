import { HttpException, Injectable } from '@nestjs/common';
import { User } from '../users/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import {
  FriendRequest,
  FriendRequestStatus,
} from './schemas/friend-request.schema';
import { Model, Types } from 'mongoose';
import { FriendsService } from '../friends/friends.service';
import { UsersService } from '../users/users.service';
import { FriendCreateDto } from "./dto/friend-create.dto";

@Injectable()
export class FriendRequestsService {
  constructor(
    private readonly userService: UsersService,
    private readonly friendsService: FriendsService,
    @InjectModel(FriendRequest.name)
    private readonly friendRequestModel: Model<FriendRequest>,
  ) {}

  async createFriendRequest(sender: User, { username, description } : FriendCreateDto) {
    const receiver = await this.userService.findOneByUsername(username);
    if (!receiver) throw new HttpException('User Not Found', 404);

    const exists = await this.isPending(sender._id, receiver._id);
    if (exists) throw new HttpException('Friend Request Already Exists', 400);
    if (receiver._id.equals(sender._id))
      throw new HttpException('Cannot Send Friend Request To Yourself', 400);
    const isFriends = await this.friendsService.isFriends(
      sender._id,
      receiver._id,
    );
    if (isFriends) throw new HttpException('Already Friends', 400);
    return this.friendRequestModel.create({
      sender,
      receiver,
      description,
      status: FriendRequestStatus.PENDING,
    });
  }

  async isPending(
    senderId: Types.ObjectId,
    receiverId: Types.ObjectId,
  ): Promise<FriendRequest> {
    return this.friendRequestModel.findOne({
      $or: [
        {
          sender: senderId,
          receiver: receiverId,
          status: FriendRequestStatus.PENDING,
        },
        {
          sender: receiverId,
          receiver: senderId,
          status: FriendRequestStatus.PENDING,
        },
      ],
    });
  }

  getFriendRequests(userId: Types.ObjectId): Promise<FriendRequest[]> {
    return this.friendRequestModel
      .find({
        $or: [
          { sender: userId, status: FriendRequestStatus.PENDING },
          { receiver: userId, status: FriendRequestStatus.PENDING },
        ],
      })
      .populate(['sender', 'receiver']);
  }

  async accept(friend_request_id: Types.ObjectId, user_id: Types.ObjectId) {
    const friendRequest = await this.findOneById(friend_request_id);
    if (!friendRequest)
      throw new HttpException('Friend Request Not Found', 404);
    if (friendRequest.status === FriendRequestStatus.ACCEPTED)
      throw new HttpException('Friend Request Already Accepted', 400);
    if (!friendRequest.receiver._id.equals(user_id))
      throw new HttpException('Friend Request Not For You', 400);
    const updatedFriendRequest =
      await this.friendRequestModel.findByIdAndUpdate(
        friend_request_id,
        {
          status: FriendRequestStatus.ACCEPTED,
        },
        { new: true },
      );
    const friend = await this.friendsService.createFriend(
      friendRequest.sender,
      friendRequest.receiver,
    );
    return { friend, friendRequest: updatedFriendRequest };
  }

  async findOneById(id: Types.ObjectId): Promise<FriendRequest> {
    return this.friendRequestModel.findById(id);
  }

  async cancel(friend_request_id: Types.ObjectId, user_id: Types.ObjectId) {
    const friendRequest = await this.findOneById(friend_request_id);
    if (!friendRequest)
      throw new HttpException('Friend Request Not Found', 404);
    console.log(friendRequest.sender._id, user_id);
    // nếu người gửi khác với người đang đăng nhập thì không cho hủy
    if (!friendRequest.sender._id.equals(user_id))
      throw new HttpException('Friend Request Not For You', 400);
    return this.friendRequestModel.findByIdAndDelete(friend_request_id);
  }

  async reject(friend_request_id: Types.ObjectId, user_id: Types.ObjectId) {
    const friendRequest = await this.findOneById(friend_request_id);
    if (!friendRequest)
      throw new HttpException('Friend Request Not Found', 404);
    if (friendRequest.status === FriendRequestStatus.ACCEPTED)
      throw new HttpException('Friend Request Already Accepted', 400);
    if (!friendRequest.receiver._id.equals(user_id))
      throw new HttpException('Friend Request Not For You', 400);

    return this.friendRequestModel.findByIdAndUpdate(
      friend_request_id,
      {
        status: FriendRequestStatus.REJECTED,
      },
      { new: true },
    );
  }

  async sendRandomFriendRequest(username: string) {
    const users = await this.userService.findOneByUsername(username);
    // send friend request to random user
    const allUsers = await this.userService.getUsersExcept(username);

    // send friend request to all users except the current user
    const randomUser = allUsers[Math.floor(Math.random() * allUsers.length)];
    return this.createFriendRequest(users, { username: randomUser.username, description: 'Send you a friend request.' });
  }

  async acceptAllFriendRequests() {
    const friendRequest = await this.friendRequestModel.findOneAndUpdate(
      {
        status: FriendRequestStatus.PENDING,
      },
      {
        status: FriendRequestStatus.ACCEPTED,
      },
    );

    const friend = await this.friendsService.createFriend(
      friendRequest.sender,
      friendRequest.receiver,
    );
    return { friend, friendRequest };
  }
}
