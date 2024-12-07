import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { isNil } from 'lodash';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { isValidObjectId } from 'mongoose';
import { ToolSaveService } from 'src/modules/toolSaves/tool-save.service';
import { CreateUserToolSaveDto } from './dto/create-user-tool-save.dto';
import { AuthGuard } from '@nestjs/passport';

// User Auth
@ApiBearerAuth()
@Controller('user/:userId/tool-save')
@UseGuards(AuthGuard('jwt'))
export class UserToolSaveController {
  constructor(private readonly toolFavService: ToolSaveService) {}

  @Get()
  @ApiParam({
    name: 'userId',
    required: true,
    type: String,
  })
  async getAll(@Req() req, @Param('userId') userId: string) {
    if (req.user._id != userId) {
      throw new BadRequestException('Invalid user id');
    }
    return this.toolFavService.findUserAll(userId);
  }

  @Get('/:toolFavId')
  @ApiParam({
    name: 'userId',
    required: true,
    type: String,
  })
  @ApiParam({
    name: 'toolFavId',
    required: true,
    type: String,
  })
  async findTookById(
    @Req() req,
    @Param('userId') userId: string,
    @Param('toolFavId') toolFavId: string,
  ) {
    if (!isValidObjectId(toolFavId)) {
      throw new BadRequestException('Invalid id');
    }
    if (req.user._id != userId) {
      throw new BadRequestException('Invalid user id');
    }
    const doc = await this.toolFavService.findUserOne(userId, toolFavId);
    if (isNil(doc)) {
      throw new NotFoundException();
    }
    return doc;
  }

  @Post()
  @ApiParam({
    name: 'userId',
    required: true,
    type: String,
  })
  async create(
    @Req() req,
    @Param('userId') userId: string,
    @Body() dto: CreateUserToolSaveDto,
  ) {
    if (req.user._id != userId) {
      throw new BadRequestException('Invalid user id');
    }
    try {
      return await this.toolFavService.create({
        userId,
        toolId: dto.toolId,
      });
    } catch (e) {
      if (e?.code == 11000) {
        throw new BadRequestException('The entity exists');
      }
      throw e;
    }
  }

  @Delete('/:toolFavId')
  @ApiParam({
    name: 'userId',
    required: true,
    type: String,
  })
  @ApiParam({
    name: 'toolFavId',
    required: true,
    type: String,
  })
  async deleteOne(
    @Req() req,
    @Param('userId') userId: string,
    @Param('toolFavId') toolFavId: string,
  ) {
    if (!isValidObjectId(toolFavId)) {
      throw new BadRequestException('Invalid tool fav id');
    }
    if (req.user._id != userId) {
      throw new BadRequestException('Invalid user id');
    }
    const doc = await this.toolFavService.findUserOne(userId, toolFavId);
    if (isNil(doc)) {
      throw new NotFoundException();
    }
    const isSuccess = await this.toolFavService.deleteUserOne(
      userId,
      toolFavId,
    );
    return {
      isSuccess,
    };
  }
}
