import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ToolCommentLikeService } from './tool-comment-like.service';
import { CreateToolCommentLikeDto } from './dto/create-tool-comment-like.dto';
import { isNil } from 'lodash';
import { ApiParam, ApiSecurity, ApiHeader } from '@nestjs/swagger';
import { isValidObjectId } from 'mongoose';
import { AuthGuard } from '@nestjs/passport';
import { QueryToolCommentLikeDto } from './dto/query-tool-comment-like.dto';

@ApiSecurity('api-key')
@Controller('tool-comment-like')
export class ToolCommentLikeController {
  constructor(private readonly ToolCommentLikeService: ToolCommentLikeService) {}

  @Get()
  async getAll(@Query() dto: QueryToolCommentLikeDto) {
    return this.ToolCommentLikeService.findByQuery(dto);
  }

  @ApiParam({
    name: 'id',
    required: true,
    type: String,
  })
  @Get('/:id')
  async findById(@Param('id') id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid tool id');
    }
    const doc = await this.ToolCommentLikeService.findOne(id);
    if (isNil(doc)) {
      throw new NotFoundException();
    }
    return doc;
  }

  @Post()
  @UseGuards(AuthGuard('api-key'))
  async createOne(@Body() dto: CreateToolCommentLikeDto) {
    try {
      return await this.ToolCommentLikeService.create(dto);
    } catch (e) {
      if (e?.code == 11000) {
        throw new BadRequestException('The entity exists');
      }
      throw e;
    }
  }

  @ApiParam({
    name: 'id',
    required: true,
    type: String,
  })
  @ApiHeader({
    name: 'x-api-key',
  })
  @UseGuards(AuthGuard('api-key'))
  @Delete('/:id')
  async deleteOne(@Param('id') id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid tool like id');
    }
    const doc = await this.ToolCommentLikeService.findOne(id);
    if (isNil(doc)) {
      throw new NotFoundException();
    }
    const isSuccess = await this.ToolCommentLikeService.deleteOne(id);
    return {
      isSuccess,
    };
  }
}
