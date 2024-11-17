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
import { ToolCommentFavService } from 'src/modules/toolCommentFavs/tool-comment-fav.service';
import { CreateUserToolCommentFavDto } from './dto/create-user-tool-comment-fav.dto';

// User Auth
@ApiSecurity('api-key')
@Controller('user/:userId/tool-comment-fav')
export class UserToolCommentFavController {
  constructor(private readonly toolCommentFavService: ToolCommentFavService) {}

  @Get()
  @ApiParam({
    name: 'userId',
    required: true,
    type: String,
  })
  async getAll(@Param('userId') userId: string) {
    return this.toolCommentFavService.findUserAll(userId);
  }

  @Get('/:toolCommentFavId')
  @ApiParam({
    name: 'userId',
    required: true,
    type: String,
  })
  @ApiParam({
    name: 'toolCommentFavId',
    required: true,
    type: String,
  })
  async findTookById(
    @Param('userId') userId: string,
    @Param('toolCommentFavId') toolCommentFavId: string,
  ) {
    if (!isValidObjectId(toolCommentFavId)) {
      throw new BadRequestException('Invalid id');
    }
    const doc = await this.toolCommentFavService.findUserOne(
      userId,
      toolCommentFavId,
    );
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
    @Body() dto: CreateUserToolCommentFavDto,
  ) {
    try {
      return await this.toolCommentFavService.create({
        userId,
        toolId: dto.toolId,
        toolCommentId: dto.toolCommentId,
      });
    } catch (e) {
      if (e?.code == 11000) {
        throw new BadRequestException('The entity exists');
      }
      throw e;
    }
  }

  @Delete('/:toolCommentFavId')
  @ApiParam({
    name: 'userId',
    required: true,
    type: String,
  })
  @ApiParam({
    name: 'toolCommentFavId',
    required: true,
    type: String,
  })
  async deleteOne(
    @Param('userId') userId: string,
    @Param('toolCommentFavId') toolCommentFavId: string,
  ) {
    if (!isValidObjectId(toolCommentFavId)) {
      throw new BadRequestException('Invalid tool comment fav id');
    }
    const doc = await this.toolCommentFavService.findUserOne(
      userId,
      toolCommentFavId,
    );
    if (isNil(doc)) {
      throw new NotFoundException();
    }
    const isSuccess = await this.toolCommentFavService.deleteUserOne(
      userId,
      toolCommentFavId,
    );
    return {
      isSuccess,
    };
  }
}
