import {
  Body,
  Controller,
  Get,
  Patch,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetUserBasicInfosDto } from './dto/get-user-basic-infos.dto';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { UpdateMeDto } from './dto/update-me';

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

  @Patch('/me')
  @UseGuards(AuthGuard('jwt'))
  async updateMe(@Req() req, @Body() dto: UpdateMeDto) {
    const user = req.user;
    if (!user) {
      throw new UnauthorizedException('Unauthenticated');
    }
    const isSuccess = await this.userService.updateOne(req.user._id, dto);
    return {
      isSuccess,
    };
  }
}
