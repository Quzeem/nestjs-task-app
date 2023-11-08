import {
  Body,
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth.credentials.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto';
// import { Authorize } from '../interceptors/authorize.interceptor';
import { AuthorizeGuard } from '../guards/authorize.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin')
  signIn(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsDto);
  }

  @Post('/test')
  @UseGuards(AuthGuard(), new AuthorizeGuard(['admin', 'zeemag']))
  // @Authorize(['admin', 'zeemag'])
  // @UseInterceptors(new SerializeInterceptor(UserDto)) // This is a bit long
  @Serialize(UserDto)
  test(@CurrentUser() user: User): User {
    console.log('handler is running');
    return user;
  }
}
