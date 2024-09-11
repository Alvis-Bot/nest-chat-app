import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { UserCreateReqDto } from './dto/user-create.req.dto';
import { buildPagination } from '../../common/pagination/pagination';
import { PaginationDto } from '../../common/pagination/offset/pagination.dto';
import { OrderBy } from '../../shared/constants/app.constant';

// Mock buildPagination function
jest.mock('../../common/pagination/pagination', () => ({
  buildPagination: jest.fn(),
}));

describe('UsersService', () => {
  let service: UsersService;
  let userModel: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: {
            create: jest.fn(),
            find: jest.fn(), // Assuming you use `find` for selecting users
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const dto: UserCreateReqDto = {
        /* ... mocked user create dto */
        full_name: 'John Doe',
        phone_number: '0394021814',
      };

      await service.createUser(dto);
      expect(userModel.create).toHaveBeenCalledWith({ ...dto });
    });
  });

  describe('selectUsers', () => {
    it('should return paginated users', async () => {
      const options: PaginationDto = {
        get skip(): number {
          return (this.page - 1) * this.take;
        },
        /* ... mocked pagination dto */
        q: 'John Doe',
        order: OrderBy.ASC,
        page: 1,
        take: 10,
      };

      await service.selectUsers(options);
      expect(buildPagination).toHaveBeenCalledWith(
        userModel,
        options,
        {
          $or: [
            {
              full_name: {
                $regex: options.q,
                $options: 'i',
              },
            },
            {
              phone_number: {
                $regex: options.q,
                $options: 'i',
              },
            },
          ],
        },
        {
          created_at: options.order,
        },
      );
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
