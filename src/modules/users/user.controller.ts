import {
  Controller,
  Get,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { pick } from 'lodash';

@Controller('user')
export class UserController {
  constructor() {}

  @Get('/me')
  @UseGuards(AuthGuard('jwt'))
  async getMine(@Req() req) {
    const user = req.user;
    if (!user) {
      throw new UnauthorizedException('Unauthenticated');
    }
    return pick(user, [
      '_id',
      'nickname',
      'email',
      'avatarUrl',
      'isGoogleUser',
      'isGithubUser',
    ]);
  }
}
