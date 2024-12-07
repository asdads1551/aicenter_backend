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
import { ToolCommentLikeService } from 'src/modules/toolCommentLikes/tool-comment-like.service';
import { CreateUserToolCommentLikeDto } from './dto/create-user-tool-comment-like.dto';
import { AuthGuard } from '@nestjs/passport';

// User Auth
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('user/:userId/tool-comment-like')
export class UserToolCommentLikeController {
  constructor(private readonly toolCommentLikeService: ToolCommentLikeService) {}

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
    return this.toolCommentLikeService.findUserAll(userId);
  }

  @Get('/:toolCommentLikeId')
  @ApiParam({
    name: 'userId',
    required: true,
    type: String,
  })
  @ApiParam({
    name: 'toolCommentLikeId',
    required: true,
    type: String,
  })
  async findTookById(
    @Req() req,
    @Param('userId') userId: string,
    @Param('toolCommentLikeId') toolCommentLikeId: string,
  ) {
    if (!isValidObjectId(toolCommentLikeId)) {
      throw new BadRequestException('Invalid id');
    }
    if (req.user._id != userId) {
      throw new BadRequestException('Invalid user id');
    }
    const doc = await this.toolCommentLikeService.findUserOne(
      userId,
      toolCommentLikeId,
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
    @Req() req,
    @Param('userId') userId: string,
    @Body() dto: CreateUserToolCommentLikeDto,
  ) {
    try {
      if (req.user._id != userId) {
        throw new BadRequestException('Invalid user id');
      }
      return await this.toolCommentLikeService.create({
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

  @Delete('/:toolCommentLikeId')
  @ApiParam({
    name: 'userId',
    required: true,
    type: String,
  })
  @ApiParam({
    name: 'toolCommentLikeId',
    required: true,
    type: String,
  })
  async deleteOne(
    @Req() req,
    @Param('userId') userId: string,
    @Param('toolCommentLikeId') toolCommentLikeId: string,
  ) {
    if (!isValidObjectId(toolCommentLikeId)) {
      throw new BadRequestException('Invalid tool comment like id');
    }
    if (req.user._id != userId) {
      throw new BadRequestException('Invalid user id');
    }
    const doc = await this.toolCommentLikeService.findUserOne(
      userId,
      toolCommentLikeId,
    );
    if (isNil(doc)) {
      throw new NotFoundException();
    }
    const isSuccess = await this.toolCommentLikeService.deleteUserOne(
      userId,
      toolCommentLikeId,
    );
    return {
      isSuccess,
    };
  }
}
