import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Friend } from './schemas/friend.schema';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class FriendsService {
  constructor(
    @InjectModel(Friend.name)
    private readonly friendModel: Model<Friend>,
  ) {}

  isFriends(senderId: Types.ObjectId, receiverId: Types.ObjectId) {
    return this.friendModel.findOne({
      $or: [
        {
          sender: { id: senderId },
          receiver: { id: receiverId },
        },
        {
          sender: { id: receiverId },
          receiver: { id: senderId },
        },
      ],
    });
  }

  createFriend(sender: User, receiver: User) {
    return this.friendModel.create({
      sender,
      receiver,
    });
  }

  async findFriends(user_id: Types.ObjectId) {
    return this.friendModel
      .find({
        $or: [{ sender: user_id }, { receiver: user_id }],
      })
      .populate(['sender', 'receiver']);
  }

  async deleteFriend(friend_id: Types.ObjectId, userId: Types.ObjectId) {
    const friend = await this.findOneById(friend_id);
    if (!friend) throw new HttpException('Friend Not Found', 404);
    console.log(friend);
    if (![friend.sender._id, friend.receiver._id].includes(userId))
      throw new HttpException('Unauthorized', 401);
    await this.friendModel.deleteOne({ _id: friend_id });
    return friend;
  }

  async findOneById(id: Types.ObjectId) {
    return this.friendModel.findById(id);
  }
}
