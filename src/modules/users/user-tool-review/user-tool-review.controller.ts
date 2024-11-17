import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { isNil } from 'lodash';
import { ApiParam } from '@nestjs/swagger';
import { isValidObjectId } from 'mongoose';
import { ToolReviewService } from 'src/modules/toolReviews/tool-review.service';
import { CreateUserToolReviewDto } from './dto/create-user-tool-review.dto';

// User Auth
@Controller('user/:userId/tool-review')
export class UserToolReviewController {
  constructor(private readonly toolReviewService: ToolReviewService) {}

  @Get()
  @ApiParam({
    name: 'userId',
    required: true,
    type: String,
  })
  async getAll(@Param('userId') userId: string) {
    return this.toolReviewService.findUserAll(userId);
  }

  @Get('/:toolReviewId')
  @ApiParam({
    name: 'userId',
    required: true,
    type: String,
  })
  @ApiParam({
    name: 'toolReviewId',
    required: true,
    type: String,
  })
  async findTookById(
    @Param('userId') userId: string,
    @Param('toolReviewId') toolReviewId: string,
  ) {
    if (!isValidObjectId(toolReviewId)) {
      throw new BadRequestException('Invalid id');
    }
    const doc = await this.toolReviewService.findUserOne(userId, toolReviewId);
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
    @Body() dto: CreateUserToolReviewDto,
  ) {
    try {
      return await this.toolReviewService.create({
        userId,
        toolId: dto.toolId,
        rating: dto.rating,
        comment: dto.comment,
      });
    } catch (e) {
      if (e?.code == 11000) {
        throw new BadRequestException('The entity exists');
      }
      throw e;
    }
  }

  @Delete('/:toolReviewId')
  @ApiParam({
    name: 'userId',
    required: true,
    type: String,
  })
  @ApiParam({
    name: 'toolReviewId',
    required: true,
    type: String,
  })
  async deleteTool(
    @Param('userId') userId: string,
    @Param('toolReviewId') toolReviewId: string,
  ) {
    if (!isValidObjectId(toolReviewId)) {
      throw new BadRequestException('Invalid tool review id');
    }
    const doc = await this.toolReviewService.findUserOne(userId, toolReviewId);
    if (isNil(doc)) {
      throw new NotFoundException();
    }
    const isSuccess = await this.toolReviewService.deleteUserOne(
      userId,
      toolReviewId,
    );
    return {
      isSuccess,
    };
  }
}
