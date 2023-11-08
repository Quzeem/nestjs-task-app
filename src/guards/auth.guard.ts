// I will have to implement a custom AuthGuard if i'm not using @nestjs/passport and passport-jwt strategy(automatically sets 'user' property on the request object)

// import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
// import { Observable } from 'rxjs';

// @Injectable()
// export class AuthGuard implements CanActivate {
//   // constructor(private userService: UsersService) {}

//   canActivate(
//     context: ExecutionContext,
//   ): boolean | Promise<boolean> | Observable<boolean> {
//     const request = context.switchToHttp().getRequest();
//     return true;
//   }
// }
