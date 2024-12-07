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
import { ToolSaveService } from 'src/modules/toolSaves/tool-save.service';
import { CreateUserToolSaveDto } from './dto/create-user-tool-save.dto';
import { AuthGuard } from '@nestjs/passport';

// User Auth
@ApiBearerAuth()
@Controller('user/:userId/tool-save')
@UseGuards(AuthGuard('jwt'))
export class UserToolSaveController {
  constructor(private readonly toolSaveService: ToolSaveService) {}

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
    return this.toolSaveService.findUserAll(userId);
  }

  @Get('/:toolSaveId')
  @ApiParam({
    name: 'userId',
    required: true,
    type: String,
  })
  @ApiParam({
    name: 'toolSaveId',
    required: true,
    type: String,
  })
  async findTookById(
    @Req() req,
    @Param('userId') userId: string,
    @Param('toolSaveId') toolSaveId: string,
  ) {
    if (!isValidObjectId(toolSaveId)) {
      throw new BadRequestException('Invalid id');
    }
    if (req.user._id != userId) {
      throw new BadRequestException('Invalid user id');
    }
    const doc = await this.toolSaveService.findUserOne(userId, toolSaveId);
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
    @Body() dto: CreateUserToolSaveDto,
  ) {
    if (req.user._id != userId) {
      throw new BadRequestException('Invalid user id');
    }
    try {
      return await this.toolSaveService.create({
        userId,
        toolId: dto.toolId,
      });
    } catch (e) {
      if (e?.code == 11000) {
        throw new BadRequestException('The entity exists');
      }
      throw e;
    }
  }

  @Delete('/:toolSaveId')
  @ApiParam({
    name: 'userId',
    required: true,
    type: String,
  })
  @ApiParam({
    name: 'toolSaveId',
    required: true,
    type: String,
  })
  async deleteOne(
    @Req() req,
    @Param('userId') userId: string,
    @Param('toolSaveId') toolSaveId: string,
  ) {
    if (!isValidObjectId(toolSaveId)) {
      throw new BadRequestException('Invalid tool save id');
    }
    if (req.user._id != userId) {
      throw new BadRequestException('Invalid user id');
    }
    const doc = await this.toolSaveService.findUserOne(userId, toolSaveId);
    if (isNil(doc)) {
      throw new NotFoundException();
    }
    const isSuccess = await this.toolSaveService.deleteUserOne(
      userId,
      toolSaveId,
    );
    return {
      isSuccess,
    };
  }
}
