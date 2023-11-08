import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UseInterceptors,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { plainToInstance } from 'class-transformer';

// A custom interceptor can be applied globally, to a controller(all route handlers), or to a single route handler
// intercept - automatically invoked
// ExecutionContext - contains info of the incoming request
// CallHandler - kind of a reference to the route handler in a controller
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    // Do something before a request is handles by a route handler
    // console.log('I am running before the route handler:', context);

    return next.handle().pipe(
      map((data: any) => {
        // Do something before the response is sent out
        // console.log('I am running before the response is sent out:', data);

        // Turn the data(plain) to an instance of a DTO(class)
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}

// interface ClassConstructor {
//   // eslint-disable-next-line @typescript-eslint/ban-types
//   new (...args: any[]): {};
// }

// A function that returns a decorator - we will prefix the function anywhere we use it with '@'
export function Serialize(dto: any) {
  return UseInterceptors(new SerializeInterceptor(dto));
}
