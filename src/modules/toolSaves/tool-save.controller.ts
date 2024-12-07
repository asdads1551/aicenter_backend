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
import { ToolSaveService } from './tool-save.service';
import { CreateToolSaveDto } from './dto/create-tool-save.dto';
import { isNil } from 'lodash';
import { ApiParam, ApiSecurity, ApiHeader } from '@nestjs/swagger';
import { isValidObjectId } from 'mongoose';
import { AuthGuard } from '@nestjs/passport';
import { QueryToolSaveDto } from './dto/query-tool-save.dto';

@ApiSecurity('api-key')
@Controller('tool-save')
export class ToolSaveController {
  constructor(private readonly toolSaveService: ToolSaveService) {}

  @Get()
  async getAll(@Query() dto: QueryToolSaveDto) {
    return this.toolSaveService.findByQuery(dto);
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
    const doc = await this.toolSaveService.findOne(id);
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
  async createOne(@Body() dto: CreateToolSaveDto) {
    try {
      return await this.toolSaveService.create(dto);
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
    const doc = await this.toolSaveService.findOne(id);
    if (isNil(doc)) {
      throw new NotFoundException();
    }
    const isSuccess = await this.toolSaveService.deleteOne(id);
    return {
      isSuccess,
    };
  }
}
