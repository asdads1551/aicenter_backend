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
import { ToolFavService } from './tool-fav.service';
import { CreateToolFavDto } from './dto/create-tool-fav.dto';
import { isNil } from 'lodash';
import { ApiParam, ApiSecurity } from '@nestjs/swagger';
import { isValidObjectId } from 'mongoose';
import { AuthGuard } from '@nestjs/passport';

@ApiSecurity('api-key')
@Controller('tool-fav')
@UseGuards(AuthGuard('api-key'))
export class ToolFavController {
  constructor(private readonly toolFavService: ToolFavService) {}

  @Get()
  async getAll() {
    return this.toolFavService.findAll();
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
    const doc = await this.toolFavService.findOne(id);
    if (isNil(doc)) {
      throw new NotFoundException();
    }
    return doc;
  }

  @Post()
  async createOne(@Body() dto: CreateToolFavDto) {
    try {
      return await this.toolFavService.create(dto);
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
    const doc = await this.toolFavService.findOne(id);
    if (isNil(doc)) {
      throw new NotFoundException();
    }
    const isSuccess = await this.toolFavService.deleteOne(id);
    return {
      isSuccess,
    };
  }
}
