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
import { ToolLikeService } from 'src/modules/toolLikes/tool-like.service';
import { CreateUserToolLikeDto } from './dto/create-user-tool-like.dto';

// User Auth
@ApiSecurity('api-key')
@Controller('user/:userId/tool-like')
export class UserToolLikeController {
  constructor(private readonly toolLikeService: ToolLikeService) {}

  @Get()
  @ApiParam({
    name: 'userId',
    required: true,
    type: String,
  })
  async getAll(@Param('userId') userId: string) {
    return this.toolLikeService.findUserAll(userId);
  }

  @Get('/:toolLikeId')
  @ApiParam({
    name: 'userId',
    required: true,
    type: String,
  })
  @ApiParam({
    name: 'toolLikeId',
    required: true,
    type: String,
  })
  async findTookById(
    @Param('userId') userId: string,
    @Param('toolLikeId') toolLikeId: string,
  ) {
    if (!isValidObjectId(toolLikeId)) {
      throw new BadRequestException('Invalid id');
    }
    const doc = await this.toolLikeService.findUserOne(userId, toolLikeId);
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
    @Body() dto: CreateUserToolLikeDto,
  ) {
    try {
      return await this.toolLikeService.create({
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

  @Delete('/:toolLikeId')
  @ApiParam({
    name: 'userId',
    required: true,
    type: String,
  })
  @ApiParam({
    name: 'toolLikeId',
    required: true,
    type: String,
  })
  async deleteOne(
    @Param('userId') userId: string,
    @Param('toolLikeId') toolLikeId: string,
  ) {
    if (!isValidObjectId(toolLikeId)) {
      throw new BadRequestException('Invalid tool like id');
    }
    const doc = await this.toolLikeService.findUserOne(userId, toolLikeId);
    if (isNil(doc)) {
      throw new NotFoundException();
    }
    const isSuccess = await this.toolLikeService.deleteUserOne(
      userId,
      toolLikeId,
    );
    return {
      isSuccess,
    };
  }
}
