import { Model, Query } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ToolSave } from './tool-save.schema';
import { CreateToolSaveDto } from './dto/create-tool-save.dto';
import { ToolService } from '../tools/tool.service';
import { isNil } from 'lodash';
import { QueryToolSaveDto } from './dto/query-tool-save.dto';

@Injectable()
export class ToolSaveService {
  constructor(
    @InjectModel(ToolSave.name) private toolFavModel: Model<ToolSave>,
    private readonly toolService: ToolService,
  ) {}

  async findAll(): Promise<ToolSave[]> {
    return this.toolFavModel.find().exec();
  }

  async findByQuery(dto: QueryToolSaveDto): Promise<ToolSave[]> {
    return this.toolFavModel
      .find({
        ...((dto.userId && { userId: dto.userId }) || {}),
        ...((dto.toolId && { toolId: dto.toolId }) || {}),
      })
      .exec();
  }

  async findOne(id: string): Promise<ToolSave | null> {
    return this.toolFavModel.findOne({ _id: id }).exec();
  }

  async create(createToolSaveDto: CreateToolSaveDto): Promise<ToolSave> {
    const createdCat = new this.toolFavModel(createToolSaveDto);
    const toolFav = await createdCat.save();
    try {
      await this.toolService.adjustFavs(createToolSaveDto.toolId, 1);
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

  async findUserOne(userId: string, id: string): Promise<ToolSave | null> {
    return this.toolFavModel.findOne({ _id: id, userId }).exec();
  }

  async findUserAll(userId: string): Promise<ToolSave[]> {
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
