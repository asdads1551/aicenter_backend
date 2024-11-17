import { Model, Query } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ToolFav } from './tool-fav.schema';
import { CreateToolFavDto } from './dto/create-tool-fav.dto';
import { ToolService } from '../tools/tool.service';
import { isNil } from 'lodash';
import { QueryToolFavDto } from './dto/query-tool-fav.dto';

@Injectable()
export class ToolFavService {
  constructor(
    @InjectModel(ToolFav.name) private toolFavModel: Model<ToolFav>,
    private readonly toolService: ToolService,
  ) {}

  async findAll(): Promise<ToolFav[]> {
    return this.toolFavModel.find().exec();
  }

  async findByQuery(dto: QueryToolFavDto): Promise<ToolFav[]> {
    return this.toolFavModel
      .find({
        ...((dto.userId && { userId: dto.userId }) || {}),
        ...((dto.toolId && { toolId: dto.toolId }) || {}),
      })
      .exec();
  }

  async findOne(id: string): Promise<ToolFav | null> {
    return this.toolFavModel.findOne({ _id: id }).exec();
  }

  async create(createToolFavDto: CreateToolFavDto): Promise<ToolFav> {
    const createdCat = new this.toolFavModel(createToolFavDto);
    const toolFav = await createdCat.save();
    try {
      await this.toolService.adjustFavs(createToolFavDto.toolId, 1);
    } catch (e) {
      console.error(e);
    }
    return toolFav;
  }

  async deleteOne(id: string): Promise<boolean> {
    const toolFav = await this.findOne(id);
    if (isNil(toolFav)) {
      return false;
    }
    const result = await this.toolFavModel.deleteOne({ _id: id });
    try {
      await this.toolService.adjustFavs(toolFav.toolId, -1);
    } catch (e) {
      console.error(e);
    }
    return result.deletedCount === 1;
  }

  async findUserOne(userId: string, id: string): Promise<ToolFav | null> {
    return this.toolFavModel.findOne({ _id: id, userId }).exec();
  }

  async findUserAll(userId: string): Promise<ToolFav[]> {
    return this.toolFavModel.find({ userId }).exec();
  }

  async deleteUserOne(userId: string, id: string): Promise<boolean> {
    const toolFav = await this.findUserOne(userId, id);
    if (isNil(toolFav)) {
      return false;
    }
    const result = await this.toolFavModel.deleteOne({ userId, _id: id });
    try {
      await this.toolService.adjustFavs(toolFav.toolId, -1);
    } catch (e) {
      console.error(e);
    }
    return result.deletedCount === 1;
  }
}
