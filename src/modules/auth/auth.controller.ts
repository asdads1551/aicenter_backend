import {
  Controller,
  Get,
  Redirect,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
}
