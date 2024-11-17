import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ToolComment } from './tool-comment.schema';
import { CreateToolCommentDto } from './dto/create-tool-comment.dto';
import { ToolService } from '../tools/tool.service';
import { isNil } from 'lodash';

@Injectable()
export class ToolCommentService {
  constructor(
    @InjectModel(ToolComment.name) private toolCommentModel: Model<ToolComment>,
    private readonly toolService: ToolService,
  ) {}

  async findAll(): Promise<ToolComment[]> {
    return this.toolCommentModel.find().exec();
  }

  async findOne(id: string): Promise<ToolComment | null> {
    return this.toolCommentModel.findOne({ _id: id }).exec();
  }

  async create(
    createToolCommentDto: CreateToolCommentDto,
  ): Promise<ToolComment> {
    const createdCat = new this.toolCommentModel(createToolCommentDto);
    const toolComment = await createdCat.save();
    try {
      await this.toolService.adjustComments(createToolCommentDto.toolId, 1);
    } catch (e) {
      console.error(e);
    }
    return toolComment;
  }

  async deleteOne(id: string): Promise<boolean> {
    const toolComment = await this.findOne(id);
    if (isNil(toolComment)) {
      return false;
    }
    const result = await this.toolCommentModel.deleteOne({ _id: id });
    try {
      await this.toolService.adjustComments(toolComment.toolId, -1);
    } catch (e) {
      console.error(e);
    }
    return result.deletedCount === 1;
  }

  async findUserOne(userId: string, id: string): Promise<ToolComment | null> {
    return this.toolCommentModel.findOne({ _id: id, userId }).exec();
  }

  async findUserAll(userId: string): Promise<ToolComment[]> {
    return this.toolCommentModel.find({ userId }).exec();
  }

  async deleteUserOne(userId: string, id: string): Promise<boolean> {
    const toolComment = await this.findUserOne(userId, id);
    if (isNil(toolComment)) {
      return false;
    }
    const result = await this.toolCommentModel.deleteOne({ userId, _id: id });
    try {
      await this.toolService.adjustComments(toolComment.toolId, -1);
    } catch (e) {
      console.error(e);
    }
    return result.deletedCount === 1;
  }
}
