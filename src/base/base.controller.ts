import { Controller, Get } from '@nestjs/common';
import { AllConfigType } from '../shared/types';
import { ConfigService } from '@nestjs/config';

@Controller()
export class BaseController {
  constructor(private readonly configService: ConfigService<AllConfigType>) {}

  @Get()
  getHello(): string {
    return 'Welcome to ' + this.configService.get('app.name', { infer: true });
  }
}
