import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ToolService } from './tool.service';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';
import { isNil } from 'lodash';
import { ApiParam, ApiSecurity } from '@nestjs/swagger';
import { isValidObjectId } from 'mongoose';
import { AuthGuard } from '@nestjs/passport';

@ApiSecurity('api-key')
@Controller('tool')
export class ToolController {
  constructor(private readonly toolService: ToolService) {}

  @Get()
  async getAllTools() {
    return this.toolService.findAll();
  }

  @ApiParam({
    name: 'id',
    required: true,
    type: String,
  })
  @Get('/:id')
  async findTookById(@Param('id') id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid tool id');
    }
    const doc = await this.toolService.findOne(id);
    if (isNil(doc)) {
      throw new NotFoundException();
    }
    return doc;
  }

  @Post()
  @UseGuards(AuthGuard('api-key'))
  async createTool(@Body() createToolDto: CreateToolDto) {
    return this.toolService.create(createToolDto);
  }

  @ApiParam({
    name: 'id',
    required: true,
    type: String,
  })
  @UseGuards(AuthGuard('api-key'))
  @Patch('/:id')
  async updateTool(
    @Param('id') id: string,
    @Body() updateToolDto: UpdateToolDto,
  ) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid tool id');
    }
    const doc = await this.toolService.findOne(id);
    if (isNil(doc)) {
      throw new NotFoundException();
    }
    const isSuccess = await this.toolService.updateOne(id, updateToolDto);
    return {
      isSuccess,
    };
  }

  @ApiParam({
    name: 'id',
    required: true,
    type: String,
  })
  @UseGuards(AuthGuard('api-key'))
  @Delete('/:id')
  async deleteTool(@Param('id') id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid tool id');
    }
    const doc = await this.toolService.findOne(id);
    if (isNil(doc)) {
      throw new NotFoundException();
    }
    const isSuccess = await this.toolService.deleteOne(id);
    return {
      isSuccess,
    };
  }
}
