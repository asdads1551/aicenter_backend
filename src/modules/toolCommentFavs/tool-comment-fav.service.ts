import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ToolCommentFav } from './tool-comment-fav.schema';
import { CreateToolCommentFavDto } from './dto/create-tool-comment-fav.dto';
import { ToolCommentService } from '../toolComments/tool-comment.service';
import { isNil } from 'lodash';
import { QueryToolCommentFavDto } from './dto/query-tool-comment-fav.dto';

@Injectable()
export class ToolCommentFavService {
  constructor(
    @InjectModel(ToolCommentFav.name)
    private ToolCommentFavModel: Model<ToolCommentFav>,
    private readonly toolCommentService: ToolCommentService,
  ) {}

  async findAll(): Promise<ToolCommentFav[]> {
    return this.ToolCommentFavModel.find().exec();
  }

  async findByQuery(dto: QueryToolCommentFavDto): Promise<ToolCommentFav[]> {
    return this.ToolCommentFavModel.find({
      ...((dto.userId && { userId: dto.userId }) || {}),
      ...((dto.toolId && { toolId: dto.toolId }) || {}),
      ...((dto.toolCommentId && { toolCommentId: dto.toolCommentId }) || {}),
    }).exec();
  }

  async findOne(id: string): Promise<ToolCommentFav | null> {
    return this.ToolCommentFavModel.findOne({ _id: id }).exec();
  }

  async create(
    createToolCommentFavDto: CreateToolCommentFavDto,
  ): Promise<ToolCommentFav> {
    const entity = new this.ToolCommentFavModel(createToolCommentFavDto);
    const ToolCommentFav = await entity.save();
    try {
      const isSuccess = await this.toolCommentService.adjustFavs(
        createToolCommentFavDto.toolCommentId,
        1,
      );
      if (!isSuccess) {
        await this.ToolCommentFavModel.deleteOne({ _id: ToolCommentFav._id });
        throw new Error('Failed to adjust tool comment favCount');
      }
    } catch (e) {
      console.error(e);
    }
    return ToolCommentFav;
  }

  async deleteOne(id: string): Promise<boolean> {
    const toolCommentFav = await this.findOne(id);
    if (isNil(toolCommentFav)) {
      return false;
    }
    const result = await this.ToolCommentFavModel.deleteOne({ _id: id });
    try {
      const isSuccess = await this.toolCommentService.adjustFavs(
        toolCommentFav.toolCommentId,
        -1,
      );
      if (!isSuccess) {
        await this.ToolCommentFavModel.create({
          toolCommentId: toolCommentFav.toolCommentId,
          userId: toolCommentFav.userId,
          toolId: toolCommentFav.toolId,
        });
        throw new Error('Failed to delete tool comment favCount');
      }
    } catch (e) {
      console.error(e);
    }
    return result.deletedCount === 1;
  }

  async findUserOne(
    userId: string,
    id: string,
  ): Promise<ToolCommentFav | null> {
    return this.ToolCommentFavModel.findOne({ _id: id, userId }).exec();
  }

  async findUserAll(userId: string): Promise<ToolCommentFav[]> {
    return this.ToolCommentFavModel.find({ userId }).exec();
  }

  async deleteUserOne(userId: string, id: string): Promise<boolean> {
    const ToolCommentFav = await this.findUserOne(userId, id);
    if (isNil(ToolCommentFav)) {
      return false;
    }
    const result = await this.ToolCommentFavModel.deleteOne({
      userId,
      _id: id,
    });
    try {
      await this.toolCommentService.adjustFavs(
        ToolCommentFav.toolCommentId,
        -1,
      );
    } catch (e) {
      console.error(e);
    }
    return result.deletedCount === 1;
  }
}
