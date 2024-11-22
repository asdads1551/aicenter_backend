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
import { ToolLikeService } from './tool-like.service';
import { CreateToolLikeDto } from './dto/create-tool-like.dto';
import { isNil } from 'lodash';
import { ApiParam, ApiSecurity, ApiHeader } from '@nestjs/swagger';
import { isValidObjectId } from 'mongoose';
import { AuthGuard } from '@nestjs/passport';

@ApiSecurity('api-key')
@Controller('tool-like')
export class ToolLikeController {
  constructor(private readonly toolLikeService: ToolLikeService) {}

  @Get()
  async getAll() {
    return this.toolLikeService.findAll();
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
    const doc = await this.toolLikeService.findOne(id);
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
  async createOne(@Body() dto: CreateToolLikeDto) {
    try {
      return await this.toolLikeService.create(dto);
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
  @ApiHeader({
    name: 'x-api-key',
  })
  @UseGuards(AuthGuard('api-key'))
  async deleteOne(@Param('id') id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid tool like id');
    }
    const doc = await this.toolLikeService.findOne(id);
    if (isNil(doc)) {
      throw new NotFoundException();
    }
    const isSuccess = await this.toolLikeService.deleteOne(id);
    return {
      isSuccess,
    };
  }
}
