import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

export class AuthorizeGuard implements CanActivate {
  constructor(private roles: string[]) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    console.log('Authorization kicking in!!!');

    if (!request.user) return false;

    // request.user.role
    if (!this.roles.includes(request.user.username)) return false;

    return true;
  }
}
