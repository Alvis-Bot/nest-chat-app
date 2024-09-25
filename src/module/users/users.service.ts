import { Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserCreateReqDto } from './dto/user-create.req.dto';
import { buildPagination } from '../../common/pagination/pagination';
import { PaginationDto } from '../../common/pagination/offset/pagination.dto';
import { RegisterResDto } from '../auth/dto/register.res.dto';

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

  async findOneByUsername(username: string) {
    return this.userModel
      .findOne({
        username,
      })
      .exec();
  }

  create(dto: RegisterResDto) {
    return this.userModel.create(dto);
  }
}
