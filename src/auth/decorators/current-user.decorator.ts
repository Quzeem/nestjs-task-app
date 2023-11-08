import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../user.entity';

// A custom decorator
// Whatever we provide to the decorator will be the data e.g @CurrentUser('John Doe') implies data will be 'John Doe'
// We can annotate data with 'never' type to prevent if we're not expecting any data
// NB: param decorators exist outside the DI system. so, a decorator cannot get an instance of a service directly. The solution is to make use of an interceptor, then use the value produced by it in a decorator.
export const CurrentUser = createParamDecorator(
  (data: never, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest(); // Get the incoming request
    return request.user;
  },
);
