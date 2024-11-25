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
} from '@nestjs/common';
import { isNil } from 'lodash';
import { ApiParam } from '@nestjs/swagger';
import { isValidObjectId } from 'mongoose';
import { ToolCommentService } from 'src/modules/toolComments/tool-comment.service';
import { CreateUserToolCommentDto } from './dto/create-user-tool-comment.dto';
import { UpdateUserToolCommentDto } from './dto/update-user-tool-comment.dto';

// User Auth
@Controller('user/:userId/tool-comment')
export class UserToolCommentController {
  constructor(private readonly toolCommentService: ToolCommentService) {}

  @Get()
  @ApiParam({
    name: 'userId',
    required: true,
    type: String,
  })
  async getAll(@Param('userId') userId: string) {
    return this.toolCommentService.findUserAll(userId);
  }

  @Get('/:toolCommentId')
  @ApiParam({
    name: 'userId',
    required: true,
    type: String,
  })
  @ApiParam({
    name: 'toolCommentId',
    required: true,
    type: String,
  })
  async findTookById(
    @Param('userId') userId: string,
    @Param('toolCommentId') toolCommentId: string,
  ) {
    if (!isValidObjectId(toolCommentId)) {
      throw new BadRequestException('Invalid id');
    }
    const doc = await this.toolCommentService.findUserOne(
      userId,
      toolCommentId,
    );
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
    @Param('userId') userId: string,
    @Body() dto: CreateUserToolCommentDto,
  ) {
    try {
      return await this.toolCommentService.create({
        userId,
        toolId: dto.toolId,
        comment: dto.comment,
      });
    } catch (e) {
      if (e?.code == 11000) {
        throw new BadRequestException('The entity exists');
      }
      throw e;
    }
  }

  @Patch('/:toolCommentId')
  @ApiParam({
    name: 'userId',
    required: true,
    type: String,
  })
  @ApiParam({
    name: 'toolCommentId',
    required: true,
    type: String,
  })
  async update(
    @Param('userId') userId: string,
    @Param('toolCommentId') toolCommentId: string,
    @Body() dto: UpdateUserToolCommentDto,
  ) {
    if (!isValidObjectId(toolCommentId)) {
      throw new BadRequestException('Invalid tool review id');
    }
    const doc = await this.toolCommentService.findUserOne(
      userId,
      toolCommentId,
    );
    if (isNil(doc)) {
      throw new NotFoundException();
    }
    const isSuccess = await this.toolCommentService.updateUserOne(
      userId,
      toolCommentId,
      dto,
    );
    return {
      isSuccess,
    };
  }

  @Delete('/:toolCommentId')
  @ApiParam({
    name: 'userId',
    required: true,
    type: String,
  })
  @ApiParam({
    name: 'toolCommentId',
    required: true,
    type: String,
  })
  async deleteOne(
    @Param('userId') userId: string,
    @Param('toolCommentId') toolCommentId: string,
  ) {
    if (!isValidObjectId(toolCommentId)) {
      throw new BadRequestException('Invalid tool review id');
    }
    const doc = await this.toolCommentService.findUserOne(
      userId,
      toolCommentId,
    );
    if (isNil(doc)) {
      throw new NotFoundException();
    }
    const isSuccess = await this.toolCommentService.deleteUserOne(
      userId,
      toolCommentId,
    );
    return {
      isSuccess,
    };
  }
}
