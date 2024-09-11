import { Test, TestingModule } from '@nestjs/testing';
import { BaseController } from './base.controller';
import { ConfigService } from '@nestjs/config';

describe('BaseController', () => {
  let controller: BaseController;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BaseController],
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => 'app.name'), // mock implementation
          },
        },
      ],
    }).compile();

    controller = module.get<BaseController>(BaseController);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('show return "Welcome to app.name"', () => {
    expect(controller.getHello()).toBe('Welcome to app.name');
    expect(configService.get).toHaveBeenCalledWith('app.name', { infer: true });
  });
});
