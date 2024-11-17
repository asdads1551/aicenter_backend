import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ToolReview } from './tool-review.schema';
import { CreateToolReviewDto } from './dto/create-tool-review.dto';
import { QueryToolReviewDto } from './dto/query-tool-review.dto';
import { ToolService } from '../tools/tool.service';
import { isNil } from 'lodash';

@Injectable()
export class ToolReviewService {
  constructor(
    @InjectModel(ToolReview.name) private toolReviewModel: Model<ToolReview>,
    private readonly toolService: ToolService,
  ) {}

  async findAll(): Promise<ToolReview[]> {
    return this.toolReviewModel.find().exec();
  }

  async findByQuery(dto: QueryToolReviewDto): Promise<ToolReview[]> {
    return this.toolReviewModel
      .find({
        ...((dto.userId && { userId: dto.userId }) || {}),
        ...((dto.toolId && { toolId: dto.toolId }) || {}),
      })
      .exec();
  }

  async findByToolId(toolId: string): Promise<ToolReview[]> {
    return this.toolReviewModel
      .find({
        toolId,
      })
      .exec();
  }

  async findOne(id: string): Promise<ToolReview | null> {
    return this.toolReviewModel.findOne({ _id: id }).exec();
  }

  async create(createToolReviewDto: CreateToolReviewDto): Promise<ToolReview> {
    const createdCat = new this.toolReviewModel(createToolReviewDto);
    const toolReview = await createdCat.save();
    try {
      await this.toolService.addReview(
        createToolReviewDto.toolId,
        createToolReviewDto.rating,
      );
    } catch (e) {
      console.error(e);
    }
    return toolReview;
  }

  async deleteOne(id: string): Promise<boolean> {
    const toolReview = await this.findOne(id);
    if (isNil(toolReview)) {
      return false;
    }
    const result = await this.toolReviewModel.deleteOne({ _id: id });
    try {
      await this.toolService.deleteReview(toolReview.toolId, toolReview.rating);
    } catch (e) {
      console.error(e);
    }
    return result.deletedCount === 1;
  }

  async findUserOne(userId: string, id: string): Promise<ToolReview | null> {
    return this.toolReviewModel.findOne({ _id: id, userId }).exec();
  }

  async findUserAll(userId: string): Promise<ToolReview[]> {
    return this.toolReviewModel.find({ userId }).exec();
  }

  async deleteUserOne(userId: string, id: string): Promise<boolean> {
    const toolReview = await this.findUserOne(userId, id);
    if (isNil(toolReview)) {
      return false;
    }
    const result = await this.toolReviewModel.deleteOne({ userId, _id: id });
    try {
      await this.toolService.deleteReview(toolReview.toolId, toolReview.rating);
    } catch (e) {
      console.error(e);
    }
    return result.deletedCount === 1;
  }
}
