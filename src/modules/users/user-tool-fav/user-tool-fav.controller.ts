import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { isNil } from 'lodash';
import { ApiParam, ApiSecurity } from '@nestjs/swagger';
import { isValidObjectId } from 'mongoose';
import { ToolFavService } from 'src/modules/toolFavs/tool-fav.service';
import { CreateUserToolFavDto } from './dto/create-user-tool-fav.dto';

// User Auth
@ApiSecurity('api-key')
@Controller('user/:userId/tool-fav')
export class UserToolFavController {
  constructor(private readonly toolFavService: ToolFavService) {}

  @Get()
  @ApiParam({
    name: 'userId',
    required: true,
    type: String,
  })
  async getAll(@Param('userId') userId: string) {
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
    @Param('userId') userId: string,
    @Param('toolFavId') toolFavId: string,
  ) {
    if (!isValidObjectId(toolFavId)) {
      throw new BadRequestException('Invalid id');
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
    @Param('userId') userId: string,
    @Body() dto: CreateUserToolFavDto,
  ) {
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
    @Param('userId') userId: string,
    @Param('toolFavId') toolFavId: string,
  ) {
    if (!isValidObjectId(toolFavId)) {
      throw new BadRequestException('Invalid tool fav id');
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
