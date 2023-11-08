import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UseInterceptors,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

// SHOULD I HAVE USED A GUARD???
export class AuthorizeInterceptor implements NestInterceptor {
  constructor(private roles: string[]) {}

  intercept(ctx: ExecutionContext, next: CallHandler<any>): Observable<any> {
    const request = ctx.switchToHttp().getRequest(); // Get the incoming request

    if (!request.user) {
      throw new UnauthorizedException(
        'You are not logged in! Please log in to get access',
      );
    }

    // request.user.role
    if (!this.roles.includes(request.user.username)) {
      throw new ForbiddenException(
        'You do not have the permission to perform this action',
      );
    }

    return next.handle();
  }
}

// A function that returns a decorator - we will prefix the function anywhere we use it with '@'
export const Authorize = (roles: string[]) => {
  return UseInterceptors(new AuthorizeInterceptor(roles));
};
