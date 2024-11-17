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
import { ToolCommentFavService } from './tool-comment-fav.service';
import { CreateToolCommentFavDto } from './dto/create-tool-comment-fav.dto';
import { isNil } from 'lodash';
import { ApiParam, ApiSecurity } from '@nestjs/swagger';
import { isValidObjectId } from 'mongoose';
import { AuthGuard } from '@nestjs/passport';
import { QueryToolCommentFavDto } from './dto/query-tool-comment-fav.dto';

@ApiSecurity('api-key')
@Controller('tool-comment-fav')
export class ToolCommentFavController {
  constructor(private readonly ToolCommentFavService: ToolCommentFavService) {}

  @Get()
  async getAll(@Query() dto: QueryToolCommentFavDto) {
    return this.ToolCommentFavService.findByQuery(dto);
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
    const doc = await this.ToolCommentFavService.findOne(id);
    if (isNil(doc)) {
      throw new NotFoundException();
    }
    return doc;
  }

  @Post()
  @UseGuards(AuthGuard('api-key'))
  async createOne(@Body() dto: CreateToolCommentFavDto) {
    try {
      return await this.ToolCommentFavService.create(dto);
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
  @UseGuards(AuthGuard('api-key'))
  @Delete('/:id')
  async deleteOne(@Param('id') id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid tool like id');
    }
    const doc = await this.ToolCommentFavService.findOne(id);
    if (isNil(doc)) {
      throw new NotFoundException();
    }
    const isSuccess = await this.ToolCommentFavService.deleteOne(id);
    return {
      isSuccess,
    };
  }
}
