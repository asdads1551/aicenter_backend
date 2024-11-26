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
import { ToolReviewService } from 'src/modules/toolReviews/tool-review.service';
import { CreateUserToolReviewDto } from './dto/create-user-tool-review.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('user/:userId/tool-review')
export class UserToolReviewController {
  constructor(private readonly toolReviewService: ToolReviewService) {}

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
    @Req() req,
    @Param('userId') userId: string,
    @Param('toolReviewId') toolReviewId: string,
  ) {
    if (!isValidObjectId(toolReviewId)) {
      throw new BadRequestException('Invalid id');
    }
    if (req.user._id != userId) {
      throw new BadRequestException('Invalid user id');
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
    @Req() req,
    @Param('userId') userId: string,
    @Body() dto: CreateUserToolReviewDto,
  ) {
    try {
      if (req.user._id != userId) {
        throw new BadRequestException('Invalid user id');
      }
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
  async deleteOne(
    @Req() req,
    @Param('userId') userId: string,
    @Param('toolReviewId') toolReviewId: string,
  ) {
    if (!isValidObjectId(toolReviewId)) {
      throw new BadRequestException('Invalid tool review id');
    }
    if (req.user._id != userId) {
      throw new BadRequestException('Invalid user id');
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
