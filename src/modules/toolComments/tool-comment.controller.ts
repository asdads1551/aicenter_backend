import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ToolCommentService } from './tool-comment.service';
import { CreateToolCommentDto } from './dto/create-tool-comment.dto';
import { isNil } from 'lodash';
import { ApiParam, ApiSecurity } from '@nestjs/swagger';
import { isValidObjectId } from 'mongoose';
import { AuthGuard } from '@nestjs/passport';

@ApiSecurity('api-key')
@Controller('tool-like')
@UseGuards(AuthGuard('api-key'))
export class ToolCommentController {
  constructor(private readonly toolCommentService: ToolCommentService) {}

  @Get()
  async getAll() {
    return this.toolCommentService.findAll();
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
