import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ToolCommentLike } from './tool-comment-like.schema';
import { CreateToolCommentLikeDto } from './dto/create-tool-comment-like.dto';
import { ToolCommentService } from '../toolComments/tool-comment.service';
import { isNil } from 'lodash';
import { QueryToolCommentLikeDto } from './dto/query-tool-comment-like.dto';

@Injectable()
export class ToolCommentLikeService {
  constructor(
    @InjectModel(ToolCommentLike.name)
    private ToolCommentLikeModel: Model<ToolCommentLike>,
    private readonly toolCommentService: ToolCommentService,
  ) {}

  async findAll(): Promise<ToolCommentLike[]> {
    return this.ToolCommentLikeModel.find().exec();
  }

  async findByQuery(dto: QueryToolCommentLikeDto): Promise<ToolCommentLike[]> {
    return this.ToolCommentLikeModel.find({
      ...((dto.userId && { userId: dto.userId }) || {}),
      ...((dto.toolId && { toolId: dto.toolId }) || {}),
      ...((dto.toolCommentId && { toolCommentId: dto.toolCommentId }) || {}),
    }).exec();
  }

  async findOne(id: string): Promise<ToolCommentLike | null> {
    return this.ToolCommentLikeModel.findOne({ _id: id }).exec();
  }

  async create(
    createToolCommentLikeDto: CreateToolCommentLikeDto,
  ): Promise<ToolCommentLike> {
    const entity = new this.ToolCommentLikeModel(createToolCommentLikeDto);
    const ToolCommentLike = await entity.save();
    try {
      const isSuccess = await this.toolCommentService.adjustLikes(
        createToolCommentLikeDto.toolCommentId,
        1,
      );
      if (!isSuccess) {
        await this.ToolCommentLikeModel.deleteOne({ _id: ToolCommentLike._id });
        throw new Error('Failed to adjust tool comment saveCount');
      }
    } catch (e) {
      console.error(e);
    }
    return ToolCommentLike;
  }

  async deleteOne(id: string): Promise<boolean> {
    const toolCommentLike = await this.findOne(id);
    if (isNil(toolCommentLike)) {
      return false;
    }
    const result = await this.ToolCommentLikeModel.deleteOne({ _id: id });
    try {
      const isSuccess = await this.toolCommentService.adjustLikes(
        toolCommentLike.toolCommentId,
        -1,
      );
      if (!isSuccess) {
        await this.ToolCommentLikeModel.create({
          toolCommentId: toolCommentLike.toolCommentId,
          userId: toolCommentLike.userId,
          toolId: toolCommentLike.toolId,
        });
        throw new Error('Failed to delete tool comment saveCount');
      }
    } catch (e) {
      console.error(e);
    }
    return result.deletedCount === 1;
  }

  async findUserOne(
    userId: string,
    id: string,
  ): Promise<ToolCommentLike | null> {
    return this.ToolCommentLikeModel.findOne({ _id: id, userId }).exec();
  }

  async findUserAll(userId: string): Promise<ToolCommentLike[]> {
    return this.ToolCommentLikeModel.find({ userId }).exec();
  }

  async deleteUserOne(userId: string, id: string): Promise<boolean> {
    const ToolCommentLike = await this.findUserOne(userId, id);
    if (isNil(ToolCommentLike)) {
      return false;
    }
    const result = await this.ToolCommentLikeModel.deleteOne({
      userId,
      _id: id,
    });
    try {
      await this.toolCommentService.adjustLikes(
        ToolCommentLike.toolCommentId,
        -1,
      );
    } catch (e) {
      console.error(e);
    }
    return result.deletedCount === 1;
  }
}
