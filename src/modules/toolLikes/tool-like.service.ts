import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ToolLike } from './tool-like.schema';
import { CreateToolLikeDto } from './dto/create-tool-like.dto';
import { ToolService } from '../tools/tool.service';
import { isNil } from 'lodash';

@Injectable()
export class ToolLikeService {
  constructor(
    @InjectModel(ToolLike.name) private toolLikeModel: Model<ToolLike>,
    private readonly toolService: ToolService,
  ) {}

  async findAll(): Promise<ToolLike[]> {
    return this.toolLikeModel.find().exec();
  }

  async findOne(id: string): Promise<ToolLike | null> {
    return this.toolLikeModel.findOne({ _id: id }).exec();
  }

  async create(createToolLikeDto: CreateToolLikeDto): Promise<ToolLike> {
    const createdCat = new this.toolLikeModel(createToolLikeDto);
    const toolLike = await createdCat.save();
    try {
      await this.toolService.adjustLikes(createToolLikeDto.toolId, 1);
    } catch (e) {
      console.error(e);
    }
    return toolLike;
  }

  async deleteOne(id: string): Promise<boolean> {
    const toolLike = await this.findOne(id);
    if (isNil(toolLike)) {
      return false;
    }
    const result = await this.toolLikeModel.deleteOne({ _id: id });
    try {
      await this.toolService.adjustLikes(toolLike.toolId, -1);
    } catch (e) {
      console.error(e);
    }
    return result.deletedCount === 1;
  }
}
