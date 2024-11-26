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
import { ToolCommentFavService } from 'src/modules/toolCommentFavs/tool-comment-fav.service';
import { CreateUserToolCommentFavDto } from './dto/create-user-tool-comment-fav.dto';
import { AuthGuard } from '@nestjs/passport';

// User Auth
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('user/:userId/tool-comment-fav')
export class UserToolCommentFavController {
  constructor(private readonly toolCommentFavService: ToolCommentFavService) {}

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
    @Req() req,
    @Param('userId') userId: string,
    @Param('toolCommentFavId') toolCommentFavId: string,
  ) {
    if (!isValidObjectId(toolCommentFavId)) {
      throw new BadRequestException('Invalid id');
    }
    if (req.user._id != userId) {
      throw new BadRequestException('Invalid user id');
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
    @Req() req,
    @Param('userId') userId: string,
    @Body() dto: CreateUserToolCommentFavDto,
  ) {
    try {
      if (req.user._id != userId) {
        throw new BadRequestException('Invalid user id');
      }
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
    @Req() req,
    @Param('userId') userId: string,
    @Param('toolCommentFavId') toolCommentFavId: string,
  ) {
    if (!isValidObjectId(toolCommentFavId)) {
      throw new BadRequestException('Invalid tool comment fav id');
    }
    if (req.user._id != userId) {
      throw new BadRequestException('Invalid user id');
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
