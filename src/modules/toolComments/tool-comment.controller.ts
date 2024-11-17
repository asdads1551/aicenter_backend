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
import { ToolCommentService } from './tool-comment.service';
import { CreateToolCommentDto } from './dto/create-tool-comment.dto';
import { isNil } from 'lodash';
import { ApiParam, ApiSecurity, ApiHeader } from '@nestjs/swagger';
import { isValidObjectId } from 'mongoose';
import { AuthGuard } from '@nestjs/passport';
import { QueryToolCommentDto } from './dto/query-tool-comment.dto';

@ApiSecurity('api-key')
@Controller('tool-comment')
export class ToolCommentController {
  constructor(private readonly toolCommentService: ToolCommentService) {}

  @Get()
  async findByQuery(@Query() dto: QueryToolCommentDto) {
    return this.toolCommentService.findByQuery(dto);
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
    const doc = await this.toolCommentService.findOne(id);
    if (isNil(doc)) {
      throw new NotFoundException();
    }
    return doc;
  }

  @Post()
  @ApiHeader({
    name: 'x-api-key',
  })
  @UseGuards(AuthGuard('api-key'))
  async createOne(@Body() dto: CreateToolCommentDto) {
    try {
      return await this.toolCommentService.create(dto);
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
    const doc = await this.toolCommentService.findOne(id);
    if (isNil(doc)) {
      throw new NotFoundException();
    }
    const isSuccess = await this.toolCommentService.deleteOne(id);
    return {
      isSuccess,
    };
  }
}
