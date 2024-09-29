import { Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { Model, Types } from "mongoose";
import { InjectModel } from '@nestjs/mongoose';
import { UserCreateReqDto } from './dto/user-create.req.dto';
import { buildPagination } from '../../common/pagination/pagination';
import { PaginationDto } from '../../common/pagination/offset/pagination.dto';
import { RegisterResDto } from '../auth/dto/register.res.dto';
import { generateUser } from '../../shared/utils/data.util';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  createUser(dto: UserCreateReqDto) {
    return this.userModel.create(dto);
  }

  async selectUsers(options: PaginationDto) {
    return await buildPagination(
      this.userModel,
      options,
      {
        ...(options.q
          ? {
              $or: [
                {
                  full_name: {
                    $regex: options.q,
                    $options: 'i',
                  },
                },
              ],
            }
          : {}),
      },
      {
        created_at: options.order,
        // updated_at: options.order,
      },
    );
  }

  async findOneByUsername(username: string) : Promise<User> {
    return this.userModel
      .findOne({
        username,
      })
      .exec();
  }

  create(dto: RegisterResDto): Promise<User> {
    return this.userModel.create(dto);
  }

  async random() {
    const users = generateUser(10);
    return this.userModel.create(users);
  }

  async getUsersExcept(username: string) {
    return this.userModel
      .find({
        username: { $ne: username },
      })
      .exec();
  }


  updateRefreshToken(userId: Types.ObjectId, hashedRefreshToken: string) {
    return this.userModel
      .updateOne(
        {
          _id: userId,
        },
        {
          $set: {
            refresh_token: hashedRefreshToken,
          },
        },
      )
      .exec();
  }
}
