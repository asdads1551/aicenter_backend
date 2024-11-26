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
  Req,
  UseGuards,
} from '@nestjs/common';
import { isNil } from 'lodash';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { isValidObjectId } from 'mongoose';
import { ToolCommentService } from 'src/modules/toolComments/tool-comment.service';
import { CreateUserToolCommentDto } from './dto/create-user-tool-comment.dto';
import { UpdateUserToolCommentDto } from './dto/update-user-tool-comment.dto';
import { AuthGuard } from '@nestjs/passport';

// User Auth
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('user/:userId/tool-comment')
export class UserToolCommentController {
  constructor(private readonly toolCommentService: ToolCommentService) {}

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
    @Req() req,
    @Param('userId') userId: string,
    @Param('toolCommentId') toolCommentId: string,
  ) {
    if (!isValidObjectId(toolCommentId)) {
      throw new BadRequestException('Invalid id');
    }
    if (req.user._id != userId) {
      throw new BadRequestException('Invalid user id');
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
    @Req() req,
    @Param('userId') userId: string,
    @Body() dto: CreateUserToolCommentDto,
  ) {
    try {
      if (req.user._id != userId) {
        throw new BadRequestException('Invalid user id');
      }
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
    @Req() req,
    @Param('userId') userId: string,
    @Param('toolCommentId') toolCommentId: string,
    @Body() dto: UpdateUserToolCommentDto,
  ) {
    if (!isValidObjectId(toolCommentId)) {
      throw new BadRequestException('Invalid tool review id');
    }
    if (req.user._id != userId) {
      throw new BadRequestException('Invalid user id');
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
    @Req() req,
    @Param('userId') userId: string,
    @Param('toolCommentId') toolCommentId: string,
  ) {
    if (!isValidObjectId(toolCommentId)) {
      throw new BadRequestException('Invalid tool review id');
    }
    if (req.user._id != userId) {
      throw new BadRequestException('Invalid user id');
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
