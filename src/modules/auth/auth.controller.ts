import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Redirect,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ApiHeader } from '@nestjs/swagger';
import { MockSigninDto } from './dto/mock-signin.dto';
import { UserService } from '../users/user.service';
import { get } from 'lodash';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('/google/redirect')
  @Redirect(`${process.env.FRONTEND_HOST}`, 302)
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    if (!req.user) {
      throw new UnauthorizedException('Unauthenticated');
    }

    const token = await this.authService.signIn(req.user);
    console.log({ token });

    return { url: `${process.env.FRONTEND_HOST}/signin?token=${token}` };
  }

  @Post('/mock/login')
  @ApiHeader({
    name: 'x-api-key',
  })
  @UseGuards(AuthGuard('api-key'))
  async mockLogin(@Body() dto: MockSigninDto) {
    const user = await this.userService.findOneByEmail(dto.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return await this.authService.generateJwt({
      sub: get(user, '_id'),
      email: user.email,
    });
  }
}
