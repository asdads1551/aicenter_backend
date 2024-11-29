import {
  Controller,
  Get,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { pick } from 'lodash';
import { GetUserBasicInfosDto } from './dto/get-user-basic-infos.dto';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';

@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  @UseGuards(AuthGuard('jwt'))
  async getMine(@Req() req) {
    const user = req.user;
    if (!user) {
      throw new UnauthorizedException('Unauthenticated');
    }

    const userDto = new UserDto(user);
    return userDto.getBasicInfo();
  }

  @Get()
  async getUserBasicInfos(@Query() dto: GetUserBasicInfosDto) {
    const users = await this.userService.findAll(dto);
    const userDtos = users.map((user) => new UserDto(user));
    return userDtos.map((userDto) => userDto.getBasicInfo());
  }
}
