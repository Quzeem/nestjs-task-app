import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  pingServer(): string {
    return 'Server is up and running!!!';
  }
}
