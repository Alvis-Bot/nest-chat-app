import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PaginationDto } from '../../common/pagination/offset/pagination.dto';
import { OrderBy } from '../../shared/constants/app.constant';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            createUser: jest.fn(),
            selectUsers: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const dto = {
        full_name: 'John Doe',
        phone_number: '0394021814',
      };

      await controller.createUser(dto);
      expect(service.createUser).toHaveBeenCalledWith(dto);
    });
  });

  describe('selectUsers', () => {
    it('should return paginated users', async () => {
      const options: PaginationDto = {
        get skip(): number {
          return (this.page - 1) * this.take;
        },
        q: 'John Doe',
        order: OrderBy.DESC,
        page: 1,
        take: 10,
      };

      await controller.selectUsers(options);
      expect(service.selectUsers).toHaveBeenCalledWith(options);
    });
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
  });
});
