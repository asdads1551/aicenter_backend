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
import { ToolReviewService } from './tool-review.service';
import { CreateToolReviewDto } from './dto/create-tool-review.dto';
import { isNil } from 'lodash';
import { ApiParam, ApiSecurity } from '@nestjs/swagger';
import { isValidObjectId } from 'mongoose';
import { AuthGuard } from '@nestjs/passport';

@ApiSecurity('api-key')
@Controller('tool-review')
export class ToolReviewController {
  constructor(private readonly toolReviewService: ToolReviewService) {}

  @Get()
  async getAll() {
    return this.toolReviewService.findAll();
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
    const doc = await this.toolReviewService.findOne(id);
    if (isNil(doc)) {
      throw new NotFoundException();
    }
    return doc;
  }

  @UseGuards(AuthGuard('api-key'))
  @Post()
  async createOne(@Body() dto: CreateToolReviewDto) {
    try {
      return await this.toolReviewService.create(dto);
    } catch (e) {
      if (e?.code == 11000) {
        throw new BadRequestException('The entity exists');
      }
      throw e;
    }
  }

  @UseGuards(AuthGuard('api-key'))
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
  })
  @Delete('/:id')
  async deleteOne(@Param('id') id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid tool review id');
    }
    const doc = await this.toolReviewService.findOne(id);
    if (isNil(doc)) {
      throw new NotFoundException();
    }
    const isSuccess = await this.toolReviewService.deleteOne(id);
    return {
      isSuccess,
    };
  }
}
