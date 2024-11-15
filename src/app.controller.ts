import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/hello')
  getProduct() {
    return {
      data: [
        {
          id: 1,
          name: 'product name',
        },
        {
          id: 2,
          name: 'product name - foo',
        },
      ],
    };
  }
}
